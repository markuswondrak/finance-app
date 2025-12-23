# Enable Artifact Registry API
resource "google_project_service" "artifact_registry_api" {
  service = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

# Create the Repository (This replaces the old GCR)
resource "google_artifact_registry_repository" "finanz_app_repo" {
  location      = var.region
  repository_id = "finanz-repo"
  description   = "Docker repository for Finanz App"
  format        = "DOCKER"
  depends_on    = [google_project_service.artifact_registry_api]
}

output "repository_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.finanz_app_repo.repository_id}"
}