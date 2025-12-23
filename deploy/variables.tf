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
