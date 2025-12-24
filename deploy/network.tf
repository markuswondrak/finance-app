# ===========================
# 1. NETWORK & CONNECTIVITY 
# ===========================

# Enable VPC Access API
resource "google_project_service" "vpcaccess_api" {
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

# VPC Connector: Allows Cloud Run to talk to Private VM IPs
resource "google_vpc_access_connector" "connector" {
  name          = "finanz-vpc-conn"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28" # Range for connector traffic
  network       = "default"
  min_throughput = 200
  max_throughput = 300
  depends_on    = [google_project_service.vpcaccess_api]
}

# Cloud Router (Required for Cloud NAT)
resource "google_compute_router" "router" {
  name    = "finanz-router"
  region  = var.region
  network = "default"
}

# Cloud NAT: Allows private VMs to access the internet (outbound only)
resource "google_compute_router_nat" "nat" {
  name                               = "finanz-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# Firewall: Allow SSH (for Ansible)
resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["35.235.240.0/20"] # Google IAP IP Range
  target_tags   = ["db-server"]
}

# Firewall: Allow VPC Connector -> DB (Port 5432)
resource "google_compute_firewall" "allow_vpc_to_db" {
  name    = "allow-vpc-connector-to-db"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }
  source_ranges = ["10.8.0.0/28"] # Must match connector range
  target_tags   = ["db-server"]
}