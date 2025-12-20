This is a much more robust approach. By separating "infrastructure" (Terraform) from "configuration" (Ansible), you create a reproducible environment—perfect for disaster recovery.

Here is the complete setup.

### 1\. Terraform: The Infrastructure (`main.tf`)

This script provisions the `e2-micro` VM, the Backup Bucket, the Service Account, and the Firewall rules.

**File:** `main.tf`

```hcl
provider "google" {
  project = "your-gcp-project-id"
  region  = "europe-west3" # Frankfurt (Change as needed)
  zone    = "europe-west3-c"
}

# 1. Service Account for the VM (Security Best Practice)
resource "google_service_account" "db_sa" {
  account_id   = "finanz-db-sa"
  display_name = "Finanz App DB Service Account"
}

# 2. Storage Bucket for Backups (Archive class for low cost)
resource "google_storage_bucket" "backup_bucket" {
  name          = "finanz-app-backups-${random_id.bucket_suffix.hex}"
  location      = "EU"
  storage_class = "ARCHIVE"
  
  # Lifecycle Rule: Delete backups older than 30 days
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# 3. Grant VM permission to write to the bucket
resource "google_storage_bucket_iam_member" "sa_writer" {
  bucket = google_storage_bucket.backup_bucket.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.db_sa.email}"
}

# 4. Firewall: Allow SSH only (Default denies everything else)
resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"] # Limit this to your IP for extra security
  target_tags   = ["db-server"]
}

# 5. The VM Instance
resource "google_compute_instance" "db_instance" {
  name         = "finanz-postgres-vm"
  machine_type = "e2-micro"
  tags         = ["db-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size  = 20 # 20GB Disk
    }
  }

  network_interface {
    network = "default"
    access_config {
      # Ephemeral public IP
    }
  }

  service_account {
    email  = google_service_account.db_sa.email
    scopes = ["cloud-platform"]
  }

  # Add your SSH public key here for Ansible access
  metadata = {
    ssh-keys = "your_user:${file("~/.ssh/id_rsa.pub")}"
  }
}

output "vm_public_ip" {
  value = google_compute_instance.db_instance.network_interface.0.access_config.0.nat_ip
}

output "bucket_name" {
  value = google_storage_bucket.backup_bucket.name
}
```

-----

### 2\. Ansible: The Configuration (`playbook.yml`)

This playbook handles the "internal" logic: Swap, Postgres Tuning, and Backups.

**File:** `playbook.yml`

```yaml
---
- name: Configure Secure Postgres on Micro Instance
  hosts: all
  become: true
  vars:
    # Set these or pass them via --extra-vars
    db_name: "finanz_db"
    db_user: "finanz_user"
    db_password: "ChangeMe123!" 
    gcs_bucket_name: "finanz-app-backups-xxxx" # Get this from Terraform output
    postgres_version: "15"

  tasks:
    # --- RESILIENCE: SWAP FILE ---
    - name: Check if swap file exists
      stat:
        path: /swapfile
      register: swap_file_check

    - name: Create 2GB swap file
      command: fallocate -l 2G /swapfile
      when: not swap_file_check.stat.exists

    - name: Set swap file permissions
      file:
        path: /swapfile
        mode: '0600'

    - name: Format swap file
      command: mkswap /swapfile
      when: not swap_file_check.stat.exists

    - name: Enable swap
      command: swapon /swapfile
      when: not swap_file_check.stat.exists

    - name: Add swap to fstab
      mount:
        name: none
        src: /swapfile
        fstype: swap
        opts: sw
        state: present

    # --- INSTALLATION ---
    - name: Install PostgreSQL and basic tools
      apt:
        name:
          - "postgresql-{{ postgres_version }}"
          - "postgresql-client-{{ postgres_version }}"
          - "acl" # Required for Ansible to become unprivileged user
          - "python3-psycopg2" # Required for Ansible postgres modules
        update_cache: yes
        state: present

    # --- TUNING: CONFIG ---
    - name: Tune PostgreSQL memory for micro instance
      lineinfile:
        path: "/etc/postgresql/{{ postgres_version }}/main/postgresql.conf"
        regexp: "{{ item.regexp }}"
        line: "{{ item.line }}"
      loop:
        - { regexp: "^shared_buffers", line: "shared_buffers = 128MB" }
        - { regexp: "^work_mem", line: "work_mem = 4MB" }
        - { regexp: "^max_connections", line: "max_connections = 50" }
        - { regexp: "^maintenance_work_mem", line: "maintenance_work_mem = 64MB" }
      notify: Restart Postgres

    # --- AVAILABILITY: SYSTEMD ---
    - name: Create systemd override directory
      file:
        path: /etc/systemd/system/postgresql.service.d
        state: directory

    - name: Add systemd auto-restart override
      copy:
        dest: /etc/systemd/system/postgresql.service.d/override.conf
        content: |
          [Service]
          Restart=always
          RestartSec=5
      notify: Reload Systemd

    # --- SECURITY: HBA & USERS ---
    - name: Configure pg_hba.conf to only allow localhost and specific IPs
      template:
        src: pg_hba.conf.j2
        dest: "/etc/postgresql/{{ postgres_version }}/main/pg_hba.conf"
        owner: postgres
        group: postgres
        mode: '0640'
      notify: Restart Postgres

    - name: Create Database
      community.postgresql.postgresql_db:
        name: "{{ db_name }}"
      become_user: postgres

    - name: Create User with Password
      community.postgresql.postgresql_user:
        name: "{{ db_user }}"
        password: "{{ db_password }}"
        db: "{{ db_name }}"
        priv: "ALL"
      become_user: postgres

    # --- BACKUP: SCRIPT & CRON ---
    - name: Create backup script
      copy:
        dest: /opt/pg_backup.sh
        mode: '0700'
        content: |
          #!/bin/bash
          TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
          BACKUP_DIR="/tmp/db_backups"
          mkdir -p $BACKUP_DIR
          pg_dump -U postgres -F c -b -f "$BACKUP_DIR/{{ db_name }}_$TIMESTAMP.dump" {{ db_name }}
          if [ $? -eq 0 ]; then
            gsutil cp "$BACKUP_DIR/{{ db_name }}_$TIMESTAMP.dump" "gs://{{ gcs_bucket_name }}/"
            rm "$BACKUP_DIR/{{ db_name }}_$TIMESTAMP.dump"
          fi
      
    - name: Add backup cron job (Daily at 3 AM)
      cron:
        name: "Daily Postgres Backup"
        minute: "0"
        hour: "3"
        job: "/opt/pg_backup.sh"

  handlers:
    - name: Restart Postgres
      service:
        name: postgresql
        state: restarted

    - name: Reload Systemd
      systemd:
        daemon_reload: yes
```

**Supporting File:** `pg_hba.conf.j2` (Save this in the same folder as playbook)

```text
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     peer
# Only allow connections from localhost (SSH Tunnels land here)
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

-----

### 3\. How to Execute (The Checklist)

Here is the exact order of operations to get this running from your local machine.

#### Step 1: Terraform (Build the House)

1.  Initialize Terraform: `terraform init`
2.  Plan the infrastructure: `terraform plan -out=tfplan`
3.  Apply: `terraform apply tfplan`
4.  **Note the Outputs:** The script will output the `vm_public_ip` and `bucket_name`. Copy these.

#### Step 2: Ansible (Furnish the House)

1.  Create an inventory file named `hosts.ini`:
    ```ini
    [db_servers]
    <PASTE_VM_PUBLIC_IP_HERE> ansible_user=your_user ansible_ssh_private_key_file=~/.ssh/id_rsa
    ```
2.  Install the Postgres collection:
    ```bash
    ansible-galaxy collection install community.postgresql
    ```
3.  Run the playbook (replacing the bucket name with the one from Terraform output):
    ```bash
    ansible-playbook -i hosts.ini playbook.yml \
      --extra-vars "gcs_bucket_name=finanz-app-backups-xxxx db_password=SecurePassword!"
    ```

### What makes this setup "Production Ready" for a Micro Instance?

1.  **Swap Logic (Ansible):** The playbook checks for swap before creating it, ensuring idempotency (running it twice won't break anything).
2.  **IAM Binding (Terraform):** Instead of putting a dangerous JSON key file inside the VM for backups, we bind the permission directly to the VM's identity.
3.  **Tuning (Ansible):** The `lineinfile` tasks forcefully downgrade Postgres memory settings to ensure the 1GB RAM limit isn't breached.
4.  **Lifecycle (Terraform):** The bucket automatically deletes old backups, so you don't wake up to a surprise storage bill.
