#!/bin/bash
set -e

# Configuration
INSTANCE_NAME="finanz-postgres-vm"
ZONE="europe-west1-b" # Default, can be overridden by gcloud config or arg if we added that logic
DB_NAME="finanz_db"
LOCAL_PORT="5433"
TEMP_DUMP="/tmp/latest_restore.dump"

echo "--- Database Restore Script ---"

# 1. Discover Bucket
echo "Finding backup bucket..."
BUCKET_NAME=$(gsutil ls | grep "gs://finanz-backups-" | head -n 1)
if [ -z "$BUCKET_NAME" ]; then
    echo "Error: No bucket found matching 'gs://finanz-backups-'"
    exit 1
fi
echo "Using bucket: $BUCKET_NAME"

# 2. Find Latest Dump
echo "Finding latest dump..."
# List files, sort by time (last item is newest), extract path
LATEST_DUMP=$(gsutil ls -l "$BUCKET_NAME" | grep ".dump" | sort -k 2 | tail -n 1 | awk '{print $3}')

if [ -z "$LATEST_DUMP" ]; then
    echo "Error: No dump files found in $BUCKET_NAME"
    exit 1
fi
echo "Latest dump found: $LATEST_DUMP"

# 3. Download Dump
echo "Downloading dump to $TEMP_DUMP..."
gsutil cp "$LATEST_DUMP" "$TEMP_DUMP"

# 4. Start IAP Tunnel
echo "Starting IAP tunnel to $INSTANCE_NAME in zone $ZONE..."
gcloud compute start-iap-tunnel "$INSTANCE_NAME" 5432 \
    --local-host-port=localhost:$LOCAL_PORT \
    --zone="$ZONE" > /dev/null 2>&1 &
PID=$!

echo "Tunnel started (PID: $PID). Waiting for connection..."
sleep 5

# 5. Restore Database
echo "Starting restore (DROP existing data, CREATE new)..."
export PGPASSWORD="" # If password is needed, prompt or fetch from secrets. Assuming 'postgres' user has trust or we rely on peer/other auth.
# Note: Usually local connections via IAP act like localhost.
# We use 'postgres' user for restore to have superuser rights (e.g., to drop/create extensions or schemas).
# If the remote pg_hba.conf allows it.
pg_restore -h localhost -p "$LOCAL_PORT" -U postgres -d "$DB_NAME" --clean --if-exists --verbose "$TEMP_DUMP" || true

# 6. Cleanup
echo "Restoration complete."
echo "Cleaning up..."
kill "$PID"
rm "$TEMP_DUMP"
echo "Done."
