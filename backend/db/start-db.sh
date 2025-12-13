#!/bin/bash

# Start PostgreSQL database for finance-app backend

CONTAINER_NAME="finance-app-db"
DB_NAME="financeapp"
DB_USER="postgres"
DB_PASSWORD="admin"
DB_PORT="5432"

# Check if container already exists
if podman ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container ${CONTAINER_NAME} already exists."
    if podman ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "Container is already running."
    else
        echo "Starting existing container..."
        podman start ${CONTAINER_NAME}
    fi
else
    echo "Creating and starting new PostgreSQL container..."
    mkdir -p "$(dirname "$0")/data"
    podman run -d \
        --name ${CONTAINER_NAME} \
        -e POSTGRES_DB=${DB_NAME} \
        -e POSTGRES_USER=${DB_USER} \
        -e POSTGRES_PASSWORD=${DB_PASSWORD} \
        -p ${DB_PORT}:5432 \
        -v "$(dirname "$0")/init:/podman-entrypoint-initdb.d" \
        -v "$(dirname "$0")/data:/var/lib/postgresql/data" \
        docker.io/library/postgres:17.7-alpine
fi

echo "PostgreSQL is available at localhost:${DB_PORT}"
echo "Database: ${DB_NAME}, User: ${DB_USER}, Password: ${DB_PASSWORD}"
