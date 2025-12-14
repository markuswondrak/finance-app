```terraform
resource "google_compute_address" "google_compute_address" {
  name = "address-name"
}

resource "google_cloud_run_v2_service" "google_cloud_run_v2_service" {
  name     = "cloudrun-service"
  location = "us-central1"
  template {
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"
    }
  }
}

resource "google_secret_manager_secret" "google_secret_manager_secret" {
  secret_id = "my-secret"

  replication {
    auto {}
  }
}

resource "google_compute_instance" "google_compute_instance" {
  name         = "test-instance"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config {
    }
  }
}
```

This Terraform configuration defines four GCP resources:

1. **google_compute_address** : Reserves a static external IP address. This is a basic configuration with just the name specified.
2. **google_cloud_run_v2_service** : Deploys a Cloud Run service named "cloudrun-service" in the "us-central1" region using the hello world container image.
3. **google_secret_manager_secret** : Creates a secret in Secret Manager named "my-secret" with automatic replication.
4. **google_compute_instance** : Creates a Compute Engine instance named "test-instance" in the "us-central1-a" zone, using the "e2-micro" machine type and a Debian 11 image. A default network interface is also configured that will create an external IP for the instance.
