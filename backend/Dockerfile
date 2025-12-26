# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM docker.io/library/golang:1.25.5-alpine AS builder

# Install certificates for HTTPS (if your app makes external API calls)
RUN apk add --no-cache ca-certificates git

WORKDIR /app

# Copy dependency files first to leverage Docker layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

RUN ls -R /app

# Build the binary
# CGO_ENABLED=0 creates a statically linked binary (required for 'distroless')
# -o server names the output binary
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server/

# ==========================================
# Stage 2: Production Runtime (Distroless)
# ==========================================
# "Distroless" contains only the runtime dependencies (no shell, no package manager)
# This improves security and reduces image size significantly.
FROM gcr.io/distroless/static-debian12

WORKDIR /

# Copy the binary from the builder stage
COPY --from=builder /app/server /server

# Copy templates for email services
COPY --from=builder /app/templates /templates

# Cloud Run defaults to port 8080
EXPOSE 8080

# Run the binary
CMD ["/server"]