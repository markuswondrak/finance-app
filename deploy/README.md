# Finance App Infrastructure

## System Architecture

The application is deployed on Google Cloud Platform (GCP) using a secure, containerized architecture.

*   **Frontend (Cloud Run)**:
    *   Serves the Vue.js application and static assets.
    *   Acts as a reverse proxy to the Backend API.
    *   Publicly accessible via HTTPS.
*   **Backend (Cloud Run)**:
    *   Hosts the Go API server.
    *   Connects to the database via a Serverless VPC Access Connector.
    *   Not directly exposed to the public (traffic should flow through the Frontend).
*   **Database (Compute Engine VM)**:
    *   Hosts the PostgreSQL database.
    *   **Private Only**: No public IP address.
    *   Accessible only via the VPC network (from Backend) or via Identity-Aware Proxy (IAP) for administration.
    *   Automated daily backups to Google Cloud Storage.
*   **Networking**:
    *   **VPC Connector**: Bridges the serverless Cloud Run environment with the private VPC network.
    *   **Firewall Rules**: Strictly limits access to the database VM (IAP range for SSH, VPC Connector for SQL).

## File Structure & Definitions

*   `main.tf`: Defines the **Cloud Run services** (Frontend and Backend) and their IAM bindings.
*   `database.tf`: Defines the **Database VM**, its Service Account, and the **Backup Bucket** (GCS).
*   `network.tf`: Sets up the **VPC Access Connector** and **Firewall Rules** (SSH via IAP, DB access from connector).
*   `registry.tf`: Configures the **Artifact Registry** for storing Docker images.
*   `wif.tf`: Configures **Workload Identity Federation** for secure GitHub Actions authentication.
*   `variables.tf`: Defines project-level variables (e.g., `project_id`).
*   `db/playbook.yml`: An **Ansible Playbook** to provision the Postgres server, configure security/swap, and set up backup cron jobs.

## Connecting to the Database VM

Since the VM has no public IP, you must use **Identity-Aware Proxy (IAP)** to connect via SSH.

### Prerequisites
1.  Ensure you have the `gcloud` CLI installed and authenticated.
2.  Ensure your user has the "IAP-secured Tunnel User" role (or `roles/iap.tunnelResourceAccessor`).

### Connection Command
Run the following command in your terminal:

```bash
gcloud compute ssh finanz-postgres-vm \
    --project=YOUR_PROJECT_ID \
    --zone=europe-west1-b \
    --tunnel-through-iap
```

*Replace `YOUR_PROJECT_ID` with your actual GCP project ID.*

Once connected, you can access the database locally:
```bash
sudo -u postgres psql
```

## Deployment Guide

Follow these steps to deploy the application from scratch.

### Phase 1: Preparation & Secrets

1.  **Enable Google Cloud APIs**:
    ```bash
    gcloud services enable compute.googleapis.com \ 
        run.googleapis.com \
        artifactregistry.googleapis.com \
        secretmanager.googleapis.com \
        vpcaccess.googleapis.com \
        iap.googleapis.com \
        iamcredentials.googleapis.com 
    ```
2.  **Workload Identity Federation**: 
    The service account and authentication infrastructure are now managed via Terraform (`wif.tf`). You do not need to manually create a key.

3.  **GitHub Secrets**:
    *   `GCP_PROJECT_ID`: Your Google Cloud Project ID.
    *   `GCP_WIF_PROVIDER`: The full resource name of the Workload Identity Provider (output from Terraform: `wif_provider_name`).

### Phase 2: Infrastructure - Layer 1 (Registry & VM)

Initialize the Artifact Registry and Database VM first.

1.  Navigate to `deploy/`.
2.  Initialize Terraform:
    ```bash
    terraform init
    ```
3.  Apply specific targets:
    ```bash
    terraform apply \
      -target=google_artifact_registry_repository.finanz_app_repo \
      -target=google_compute_instance.db_instance \
      -var="project_id=YOUR_PROJECT_ID" \
      -var="db_password_initial=YOUR_SECURE_PASSWORD" \
      -var="ssh_user=YOUR_SSH_USER"
    ```
    *This creates the registry (so you can push images) and the VM (so you can configure the DB).*

### Phase 3: Build & Push Artifacts (Bootstrap)

Build the images manually once so Terraform can deploy the Cloud Run services.

1.  **Backend**:
    ```bash
    # From project root
    gcloud auth configure-docker europe-west1-docker.pkg.dev
    podman build -t europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/finanz-repo/backend:latest ./backend
    podman push europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/finanz-repo/backend:latest
    ```
2.  **Frontend**:
    ```bash
    podman build -t europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/finanz-repo/frontend:latest ./frontend
    podman push europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/finanz-repo/frontend:latest
    ```

### Phase 4: Database Configuration (Ansible)

Configure the PostgreSQL instance.
*Note: Since the VM has no public IP, you must configure SSH to use IAP.*

1.  **Configure IAP Tunnel for SSH**:
    Add this to your `~/.ssh/config`:
    ```config
    Host finanz-postgres-vm
      ProxyCommand gcloud compute start-iap-tunnel finanz-postgres-vm %p --listen-on-stdin --project=YOUR_PROJECT_ID --zone=europe-west1-b
    ```
2.  **Run Ansible**:
    
    Create hosts.ini:
    ```
    [db]
    finanz-postgres-vm ansible_connection=ssh ansible_user=SSH_USER ansible_ssh_common_args='-o ProxyCommand="gcloud compute start-iap-tunnel %h %p --listen-on-stdin --project=YOUR_PROJECT_ID --zone=europe-west1-b" -o StrictHostKeyChecking=no'
    ``` 

    Enable internet access for the vm to download the packages.

    ```bash
    ansible-playbook -i db/hosts.ini db/playbook.yml \
      --extra-vars "project_id=YOUR_PROJECT_ID gcs_bucket_name=finanz-backups-YOUR_SUFFIX vpc_cidr=10.8.0.0/28 db_password=YOUR_SECURE_PASSWORD"
    ```

### Phase 5: Infrastructure - Layer 2 (Full Deployment)

Deploy the Cloud Run services.

1.  Run the full apply:
    ```bash
    terraform apply \
      -var="github_repo=GIT_USER/REPO" \
      -var="project_id=YOUR_PROJECT_ID" \
      -var="db_password_initial=YOUR_SECURE_PASSWORD" \
      -var="ssh_user=YOUR_SSH_USER"
    ```
    *This deploys the Frontend and Backend services.*

### Phase 6: Continuous Deployment

Create service account for GitHub Actions: 

```bash
 ./create_github_sa.sh YOUR_PROJECT_ID \
       WIF_PROVIDER_PATH \
       GITHUB_USER/finance-app
```