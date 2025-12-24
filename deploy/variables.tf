variable "project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "europe-west3"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "europe-west3-c"
}

variable "db_password_initial" {
  description = "Initial database password for Secret Manager"
  type        = string
  sensitive   = true
}

variable "ssh_user" {
  description = "Username for SSH access to the VM"
  type        = string
}

variable "github_repo" {
  description = "The GitHub repository (owner/repo) allowed to authenticate"
  type        = string
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret key for signing JWT tokens"
  type        = string
  sensitive   = true
}
