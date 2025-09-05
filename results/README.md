# Test Results Directory

This directory stores test execution results in various formats:

- `*.json` - JSON output from k6 test runs
- `*.html` - HTML reports (when generated)
- `*.xml` - JUnit XML format (for CI/CD integration)

## Result Files

Results are automatically generated when running tests with output options:

```bash
# JSON output
k6 run --out json=results/load-test-results.json tests/load/api-load-test.js

# InfluxDB output (for Grafana)
k6 run --out influxdb=http://localhost:8086/k6 tests/load/api-load-test.js

# Multiple outputs
k6 run --out json=results/test.json --out influxdb=http://localhost:8086/k6 tests/load/api-load-test.js
```

## Analysis

Results can be analyzed using:
- Grafana dashboards (real-time)
- Custom scripts for JSON processing
- CI/CD pipeline reports
- k6 Cloud (with account)

This directory is included in `.gitignore` to avoid committing large result files.
