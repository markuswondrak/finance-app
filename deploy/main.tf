provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# ==========================================
# 3. SECRETS (Password Management)
# ==========================================

resource "google_secret_manager_secret" "db_password" {
  secret_id = "finanz-db-password"
  replication {
    auto {}
  }
}

# Placeholder version - YOU MUST ADD THE ACTUAL PASSWORD IN GCP CONSOLE MANUALLY
resource "google_secret_manager_secret_version" "db_password_val" {
  secret = google_secret_manager_secret.db_password.id
  secret_data = var.db_password_initial
}

# ==========================================
# 4. BACKEND SERVICE (Cloud Run)
# ==========================================

resource "google_service_account" "backend_sa" {
  account_id   = "finanz-backend-sa"
  display_name = "Finanz App Backend Service Account"
}

resource "google_cloud_run_v2_service" "backend" {
  name                = "finanz-backend"
  location            = var.region
  deletion_protection = false
  
  template {
    service_account = google_service_account.backend_sa.email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/finanz-repo/backend:latest"
      
      env {
        name  = "DB_HOST"
        # Connect to VM via Internal IP (through VPC Connector)
        value = google_compute_instance.db_instance.network_interface.0.network_ip
      }
      env {
        name = "DB_PORT"
        value = "5432"
      }
      env {
        name = "DB_NAME"
        value = "finanz_db"
      }
      env {
        name = "DB_USER"
        value = "finanz_user"
      }
      env {
        name = "DB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_password.secret_id
            version = "latest"
          }
        }
      }
    }
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }
  depends_on = [google_vpc_access_connector.connector]
}

# Allow Backend to access Secret
resource "google_secret_manager_secret_iam_member" "backend_secret_access" {
  secret_id = google_secret_manager_secret.db_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.backend_sa.email}"
}

# Allow Public Access to Backend (Optional - better to restrict to Frontend only if possible, but keeping simple)
resource "google_cloud_run_service_iam_member" "backend_public" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ==========================================
# 5. FRONTEND SERVICE (Cloud Run + Nginx)
# ==========================================

resource "google_cloud_run_v2_service" "frontend" {
  name                = "finanz-frontend"
  location            = var.region
  deletion_protection = false

  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/finanz-repo/frontend:latest"
      ports {
        container_port = 8080
      }
      # Inject Backend URL for Nginx Reverse Proxy
      env {
        name  = "BACKEND_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
    }
  }
  depends_on = [google_cloud_run_v2_service.backend]
}

resource "google_cloud_run_service_iam_member" "frontend_public" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ==========================================
# 6. OUTPUTS
# ==========================================

output "frontend_url" { value = google_cloud_run_v2_service.frontend.uri }
output "backend_url"  { value = google_cloud_run_v2_service.backend.uri }
