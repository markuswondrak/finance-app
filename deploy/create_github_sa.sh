#!/bin/bash

# ==============================================================================
# Script to create a Google Cloud Service Account for GitHub Actions
# and configure Workload Identity Federation (WIF) bindings.
#
# Usage:
#   ./create_github_sa.sh <PROJECT_ID> <POOL_PATH> <GITHUB_REPO>
#
# Example:
#   ./create_github_sa.sh my-project-id projects/123456789/locations/global/workloadIdentityPools/github-actions-pool my-user/my-repo
#
# Prerequisites:
#   - gcloud CLI installed and authenticated.
#   - You must have 'Owner' or 'Editor' permissions on the project.
# ==============================================================================

set -e

PROJECT_ID="$1"
POOL_PATH="$2"
GITHUB_REPO="$3"
SA_NAME="github-actions-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Sanitize POOL_PATH: Remove '/providers/...' if present
# The user might pass the Provider name (from Terraform output), but we need the Pool name.
POOL_PATH=${POOL_PATH%%/providers/*}

# --- Input Validation ---
if [ -z "$PROJECT_ID" ] || [ -z "$POOL_PATH" ] || [ -z "$GITHUB_REPO" ]; then
    echo "Error: Missing required arguments."
    echo "Usage: $0 <PROJECT_ID> <POOL_PATH> <GITHUB_REPO>"
    exit 1
fi

echo "==================================================="
echo "Configuring Service Account for GitHub Actions"
echo "Project ID:  $PROJECT_ID"
echo "Pool Path:   $POOL_PATH"
echo "GitHub Repo: $GITHUB_REPO"
echo "SA Email:    $SA_EMAIL"
echo "==================================================="

# --- 1. Create Service Account ---
if gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" > /dev/null 2>&1; then
    echo "✔ Service Account '$SA_NAME' already exists."
else
    echo "Creating Service Account '$SA_NAME'..."
    gcloud iam service-accounts create "$SA_NAME" \
        --description="Service Account for GitHub Actions CI/CD" \
        --display-name="GitHub Actions SA" \
        --project="$PROJECT_ID"
    echo "✔ Service Account created."
fi

# --- 2. Grant IAM Roles to Service Account ---
# Roles required for the current CI/CD pipeline (Artifact Registry Push)
# and potential future Cloud Run deployments.

ROLES=(
    "roles/artifactregistry.writer"       # Push Docker images
    "roles/serviceusage.serviceUsageConsumer" # Use Google Cloud APIs
    "roles/run.admin"                     # Deploy Cloud Run services
    "roles/iam.serviceAccountUser"        # Act as the runtime service account
)

echo "Granting IAM roles to '$SA_EMAIL'..."
for ROLE in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:${SA_EMAIL}" \
        --role="$ROLE" \
        --condition=None \
        --quiet > /dev/null
    echo "  - Granted: $ROLE"
done

# --- 3. Bind Service Account to Workload Identity Pool ---
# This allows the GitHub Actions workflow (via WIF) to impersonate this Service Account.

# The member format for WIF binding to a specific repo
WORKLOAD_IDENTITY_MEMBER="principalSet://iam.googleapis.com/${POOL_PATH}/attribute.repository/${GITHUB_REPO}"

echo "Binding Service Account to Workload Identity Pool..."
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
    --project="$PROJECT_ID" \
    --role="roles/iam.workloadIdentityUser" \
    --member="$WORKLOAD_IDENTITY_MEMBER" \
    --quiet > /dev/null

echo "✔ Binding created for repo: $GITHUB_REPO"

echo "==================================================="
echo "Setup Complete!"
echo "Use the following Service Account email in your GitHub Actions workflow:"
echo "$SA_EMAIL"
echo "==================================================="
