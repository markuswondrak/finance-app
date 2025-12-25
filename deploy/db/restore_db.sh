#!/bin/bash
set -e

# Configuration
INSTANCE_NAME="finanz-postgres-vm"
ZONE="europe-west1-b" 
DB_NAME="finanz_db"
DB_USER="finanz_user"
LOCAL_PORT="5433"
TEMP_DUMP="/tmp/latest_restore.dump"

echo "--- Database Restore Script ---"

# 0. Check for required tools
for tool in gcloud gsutil pg_restore; do
    if ! command -v $tool &> /dev/null; then
        echo "Error: $tool is not installed."
        exit 1
    fi
done

# 1. Fetch Password from Secret Manager
echo "Fetching database password..."
PGPASSWORD=$(gcloud secrets versions access latest --secret="finanz-db-password" 2>/dev/null || echo "")
if [ -z "$PGPASSWORD" ]; then
    echo "Warning: Could not fetch password from Secret Manager. You may be prompted for it."
fi
export PGPASSWORD

# 2. Discover Bucket
echo "Finding backup bucket..."
BUCKET_NAME=$(gsutil ls | grep "gs://finanz-backups-" | head -n 1)
if [ -z "$BUCKET_NAME" ]; then
    echo "Error: No bucket found matching 'gs://finanz-backups-'"
    exit 1
fi
echo "Using bucket: $BUCKET_NAME"

# 3. Find Latest Dump
echo "Finding latest dump..."
# List files, sort by time (last item is newest), extract path
LATEST_DUMP=$(gsutil ls -l "$BUCKET_NAME" | grep ".dump" | sort -k 2 | tail -n 1 | awk '{print $3}')

if [ -z "$LATEST_DUMP" ]; then
    echo "Error: No dump files found in $BUCKET_NAME"
    exit 1
}
echo "Latest dump found: $LATEST_DUMP"

# 4. Download Dump
echo "Downloading dump to $TEMP_DUMP..."
gsutil cp "$LATEST_DUMP" "$TEMP_DUMP"

# 5. Start IAP Tunnel
echo "Starting IAP tunnel to $INSTANCE_NAME in zone $ZONE..."
# We use a temp file to track if the tunnel is ready
TUNNEL_LOG=$(mktemp)
gcloud compute start-iap-tunnel "$INSTANCE_NAME" 5432 \
    --local-host-port=localhost:$LOCAL_PORT \
    --zone="$ZONE" > "$TUNNEL_LOG" 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to be ready (look for 'Listening on port')
echo "Waiting for tunnel to be ready..."
MAX_RETRIES=10
COUNT=0
while ! grep -q "Listening on port" "$TUNNEL_LOG" && [ $COUNT -lt $MAX_RETRIES ]; do
    sleep 1
    ((COUNT++))
done

# 6. Restore Database
echo "Starting restore..."
# We use --no-owner to avoid errors if the local user doesn't match the remote user
# and --role if needed, but since we are connecting as DB_USER it should be fine.
pg_restore -h localhost -p "$LOCAL_PORT" -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner --verbose "$TEMP_DUMP"

# 7. Cleanup
echo "Restoration complete."
echo "Cleaning up..."
kill "$TUNNEL_PID" 2>/dev/null || true
rm "$TEMP_DUMP" "$TUNNEL_LOG"
echo "Done."
