resource "google_compute_instance" "db_instance" {
  name         = "finanz-postgres-vm"
  machine_type = "e2-micro"
  zone         = var.zone
  tags         = ["db-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size  = 20
    }
  }

  network_interface {
    network = "default"
    # No public IP (access_config removed) for IAP access
  }

  service_account {
    email  = google_service_account.db_sa.email
    scopes = ["cloud-platform"]
  }

  metadata = {
    # Replace with your actual public key path
    ssh-keys = "${var.ssh_user}:${file("~/.ssh/id_rsa.pub")}"
  }
}


resource "google_service_account" "db_sa" {
  account_id   = "finanz-db-sa"
  display_name = "Finanz App DB Service Account"
}

resource "google_storage_bucket" "backup_bucket" {
  name          = "finanz-backups-${random_id.bucket_suffix.hex}"
  location      = "US"
  storage_class = "ARCHIVE"
  lifecycle_rule {
    condition { age = 30 }
    action { type = "Delete" }
  }
}

resource "random_id" "bucket_suffix" { byte_length = 4 }

resource "google_storage_bucket_iam_member" "sa_writer" {
  bucket = google_storage_bucket.backup_bucket.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.db_sa.email}"
}

output "bucket_name"  { value = google_storage_bucket.backup_bucket.name }