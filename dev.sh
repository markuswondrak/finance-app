#!/bin/bash

# Finance App - Local Development Script
# Hybrid approach: Container for DB, native for Backend & Frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend/cmd/server"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# PID file locations
PIDS_DIR="$PROJECT_ROOT/.dev-pids"
BACKEND_PID_FILE="$PIDS_DIR/backend.pid"
FRONTEND_PID_FILE="$PIDS_DIR/frontend.pid"

# Log file locations
LOGS_DIR="$PROJECT_ROOT/.dev-logs"
BACKEND_LOG="$LOGS_DIR/backend.log"
FRONTEND_LOG="$LOGS_DIR/frontend.log"

# Service ports
DB_PORT=5432
BACKEND_PORT=8082
FRONTEND_PORT=8081

# Container runtime (will be detected)
CONTAINER_RUNTIME=""

# Create necessary directories
mkdir -p "$PIDS_DIR" "$LOGS_DIR"

#######################################
# Helper Functions
#######################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        return 1
    fi
    return 0
}

detect_container_runtime() {
    # Check for Podman first (preferred for rootless)
    if check_command podman; then
        CONTAINER_RUNTIME="podman"
        print_info "Using Podman as container runtime"
        return 0
    fi
    
    # Fall back to Docker
    if check_command docker; then
        CONTAINER_RUNTIME="docker"
        print_info "Using Docker as container runtime"
        return 0
    fi
    
    print_error "Neither Docker nor Podman is installed."
    print_info "Please install one of them:"
    print_info "  - Podman (recommended): sudo apt install podman"
    print_info "  - Docker: https://docs.docker.com/engine/install/"
    return 1
}


check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

ensure_podman_socket() {
    if [ "$CONTAINER_RUNTIME" = "podman" ]; then
        # Check if Podman socket is running
        if ! systemctl --user is-active --quiet podman.socket 2>/dev/null; then
            print_info "Starting Podman socket..."
            systemctl --user start podman.socket 2>/dev/null || true
            sleep 1
        fi
    fi
}

wait_for_port() {
    local port=$1
    local service=$2
    local max_attempts=30
    local attempt=0

    print_info "Waiting for $service on port $port..."
    
    while [ $attempt -lt $max_attempts ]; do
        if check_port $port; then
            print_success "$service is ready on port $port"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    print_error "$service failed to start on port $port"
    return 1
}

#######################################
# Database Functions
#######################################

start_database() {
    print_header "Starting Database"
    
    # Detect container runtime
    if ! detect_container_runtime; then
        return 1
    fi
    
    # Ensure Podman socket is running if using Podman
    ensure_podman_socket
    
    # Check if database is already running
    if $CONTAINER_RUNTIME ps --format "{{.Names}}" | grep -q "^finance-app-db$"; then
        print_warning "Database is already running"
        return 0
    fi

    # Check if container exists but is stopped
    if $CONTAINER_RUNTIME ps -a --format "{{.Names}}" | grep -q "^finance-app-db$"; then
        print_info "Starting existing database container..."
        $CONTAINER_RUNTIME start finance-app-db
    else
        print_info "Creating and starting new PostgreSQL container..."
        
        # Create volume if it doesn't exist (idempotent usually, but good to be explicit for podman)
        $CONTAINER_RUNTIME volume exists postgres_data || $CONTAINER_RUNTIME volume create postgres_data
        
        $CONTAINER_RUNTIME run -d \
            --name finance-app-db \
            -p $DB_PORT:5432 \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=admin \
            -e POSTGRES_DB=financeapp \
            -v postgres_data:/var/lib/postgresql/data \
            -v "$PROJECT_ROOT/backend/db/init:/docker-entrypoint-initdb.d:Z" \
            --health-cmd "pg_isready -U postgres" \
            --health-interval 10s \
            --health-timeout 5s \
            --health-retries 5 \
            docker.io/library/postgres:15-alpine
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Database container started"
        wait_for_port $DB_PORT "PostgreSQL"
        return $?
    else
        print_error "Failed to start database"
        return 1
    fi
}

stop_database() {
    print_header "Stopping Database"
    
    # Detect container runtime
    if ! detect_container_runtime; then
        return 1
    fi
    
    if $CONTAINER_RUNTIME ps 2>/dev/null | grep -q finance-app-db; then
        print_info "Stopping PostgreSQL container..."
        $CONTAINER_RUNTIME stop finance-app-db
        $CONTAINER_RUNTIME rm finance-app-db
        print_success "Database stopped"
    else
        print_warning "Database is not running"
    fi
}

check_database() {
    # Detect container runtime
    if ! detect_container_runtime > /dev/null 2>&1; then
        print_error "No container runtime available"
        return 1
    fi
    
    if $CONTAINER_RUNTIME ps 2>/dev/null | grep -q finance-app-db; then
        print_success "Database is running (using $CONTAINER_RUNTIME)"
        return 0
    else
        print_error "Database is not running"
        return 1
    fi
}

#######################################
# Backend Functions
#######################################

start_backend() {
    print_header "Starting Backend"
    
    if ! check_command go; then
        return 1
    fi
    
    # Check if backend is already running
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid=$(cat "$BACKEND_PID_FILE")
        if ps -p $pid > /dev/null 2>&1; then
            print_warning "Backend is already running (PID: $pid)"
            return 0
        fi
    fi
    
    # Ensure database is running
    if ! check_database > /dev/null 2>&1; then
        print_error "Database must be running before starting backend"
        return 1
    fi
    
    print_info "Starting Go backend server..."
    cd "$BACKEND_DIR"
    
    # Start backend in background
    nohup go run main.go > "$BACKEND_LOG" 2>&1 &
    local pid=$!
    echo $pid > "$BACKEND_PID_FILE"
    
    print_success "Backend started (PID: $pid)"
    print_info "Backend logs: $BACKEND_LOG"
    
    wait_for_port $BACKEND_PORT "Backend API"
    return $?
}

stop_backend() {
    print_header "Stopping Backend"
    
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid=$(cat "$BACKEND_PID_FILE")
        if ps -p $pid > /dev/null 2>&1; then
            print_info "Stopping backend (PID: $pid)..."
            kill $pid
            rm "$BACKEND_PID_FILE"
            print_success "Backend stopped"
        else
            print_warning "Backend process not found"
            rm "$BACKEND_PID_FILE"
        fi
    else
        print_warning "Backend is not running"
    fi
}

check_backend() {
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid=$(cat "$BACKEND_PID_FILE")
        if ps -p $pid > /dev/null 2>&1; then
            print_success "Backend is running (PID: $pid)"
            return 0
        fi
    fi
    print_error "Backend is not running"
    return 1
}

#######################################
# Frontend Functions
#######################################

start_frontend() {
    print_header "Starting Frontend"
    
    if ! check_command npm; then
        return 1
    fi
    
    # Check if frontend is already running
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local pid=$(cat "$FRONTEND_PID_FILE")
        if ps -p $pid > /dev/null 2>&1; then
            print_warning "Frontend is already running (PID: $pid)"
            return 0
        fi
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        npm install
    fi
    
    print_info "Starting Vue.js development server..."
    
    # Start frontend in background
    nohup npm run serve > "$FRONTEND_LOG" 2>&1 &
    local pid=$!
    echo $pid > "$FRONTEND_PID_FILE"
    
    print_success "Frontend started (PID: $pid)"
    print_info "Frontend logs: $FRONTEND_LOG"
    
    wait_for_port $FRONTEND_PORT "Frontend"
    return $?
}

stop_frontend() {
    print_header "Stopping Frontend"
    
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local pid=$(cat "$FRONTEND_PID_FILE")
        if ps -p $pid > /dev/null 2>&1; then
            print_info "Stopping frontend (PID: $pid)..."
            # Kill the entire process group to stop webpack-dev-server
            pkill -P $pid
            kill $pid
            rm "$FRONTEND_PID_FILE"
            print_success "Frontend stopped"
        else
            print_warning "Frontend process not found"
            rm "$FRONTEND_PID_FILE"
        fi
    else
        print_warning "Frontend is not running"
    fi
}

check_frontend() {
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local pid=$(cat "$FRONTEND_PID_FILE")
        if ps -p $pid > /dev/null 2>&1; then
            print_success "Frontend is running (PID: $pid)"
            return 0
        fi
    fi
    print_error "Frontend is not running"
    return 1
}

#######################################
# Main Commands
#######################################

cmd_start() {
    print_header "Starting Finance App Development Environment"
    
    # Start services in order
    start_database || exit 1
    sleep 2
    start_backend || exit 1
    sleep 2
    start_frontend || exit 1
    
    echo ""
    print_header "Development Environment Ready"
    print_success "Database:  http://localhost:$DB_PORT"
    print_success "Backend:   http://localhost:$BACKEND_PORT"
    print_success "Frontend:  http://localhost:$FRONTEND_PORT"
    echo ""
    print_info "Run './dev.sh logs' to view logs"
    print_info "Run './dev.sh stop' to stop all services"
}

cmd_stop() {
    print_header "Stopping Finance App Development Environment"
    
    stop_frontend
    stop_backend
    stop_database
    
    print_success "All services stopped"
}

cmd_restart() {
    cmd_stop
    sleep 2
    cmd_start
}

cmd_status() {
    print_header "Service Status"
    
    check_database
    check_backend
    check_frontend
}

cmd_logs() {
    local service=$1
    
    case $service in
        backend|be)
            print_info "Showing backend logs (Ctrl+C to exit)..."
            tail -f "$BACKEND_LOG"
            ;;
        frontend|fe)
            print_info "Showing frontend logs (Ctrl+C to exit)..."
            tail -f "$FRONTEND_LOG"
            ;;
        db|database)
            print_info "Showing database logs (Ctrl+C to exit)..."
            detect_container_runtime > /dev/null 2>&1
            $CONTAINER_RUNTIME logs -f finance-app-db
            ;;
        all|"")
            print_info "Showing all logs (Ctrl+C to exit)..."
            detect_container_runtime > /dev/null 2>&1
            tail -f "$BACKEND_LOG" "$FRONTEND_LOG" &
            $CONTAINER_RUNTIME logs -f finance-app-db
            ;;
        *)
            print_error "Unknown service: $service"
            print_info "Available services: backend, frontend, database, all"
            exit 1
            ;;
    esac
}

cmd_clean() {
    print_header "Cleaning Development Environment"
    
    print_warning "This will stop all services and remove logs/PIDs"
    read -p "Continue? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cmd_stop
        
        print_info "Removing logs and PID files..."
        rm -rf "$PIDS_DIR" "$LOGS_DIR"
        
        print_success "Development environment cleaned"
    else
        print_info "Cancelled"
    fi
}

cmd_reset() {
    print_header "Resetting Development Environment"
    
    print_warning "This will stop all services and remove the database volume"
    read -p "Continue? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cmd_stop
        
        print_info "Removing database volume..."
        detect_container_runtime > /dev/null 2>&1
        $CONTAINER_RUNTIME stop finance-app-db 2>/dev/null || true
        $CONTAINER_RUNTIME rm finance-app-db 2>/dev/null || true
        $CONTAINER_RUNTIME volume rm postgres_data 2>/dev/null || true
        
        print_info "Removing logs and PID files..."
        rm -rf "$PIDS_DIR" "$LOGS_DIR"
        
        print_success "Development environment reset"
        print_info "Run './dev.sh start' to start fresh"
    else
        print_info "Cancelled"
    fi
}

cmd_help() {
    cat << EOF
Finance App - Development Script

USAGE:
    ./dev.sh [COMMAND]

COMMANDS:
    start           Start all services (database, backend, frontend)
    stop            Stop all services
    restart         Restart all services
    status          Show status of all services
    logs [SERVICE]  Show logs (backend|frontend|database|all)
    clean           Stop services and remove logs/PIDs
    reset           Stop services and reset database
    help            Show this help message

EXAMPLES:
    ./dev.sh start              # Start development environment
    ./dev.sh logs backend       # View backend logs
    ./dev.sh logs               # View all logs
    ./dev.sh stop               # Stop all services

SERVICES:
    Database:  PostgreSQL (Container)     - Port $DB_PORT
    Backend:   Go/Gin (Native)            - Port $BACKEND_PORT
    Frontend:  Vue.js (Native)            - Port $FRONTEND_PORT

CONTAINER RUNTIME:
    Supports both Docker and Podman (auto-detected)
    Podman is recommended for rootless containers

EOF
}

#######################################
# Main Entry Point
#######################################

main() {
    local command=${1:-start}
    
    case $command in
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        status)
            cmd_status
            ;;
        logs)
            cmd_logs "$2"
            ;;
        clean)
            cmd_clean
            ;;
        reset)
            cmd_reset
            ;;
        help|--help|-h)
            cmd_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            cmd_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
