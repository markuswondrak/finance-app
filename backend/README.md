# Finance App Backend

## Testing

The backend uses Go's standard testing tool.

### Running all tests
To run all tests in the internal package:
```bash
cd backend
go test ./internal/...
```

### Running a specific package
```bash
cd backend
go test ./internal/services
```

### Running with verbose output
```bash
cd backend
go test -v ./internal/...
```

### Running with coverage
```bash
cd backend
go test -cover ./internal/...
```
