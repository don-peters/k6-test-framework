# Configuration Guide

This guide explains how to configure your k6 testing framework for different environments and scenarios.

## Environment Configuration

### 1. Environment Variables
Set these variables to customize test behavior:

```bash
# API Configuration
export BASE_URL="https://api.example.com"
export API_KEY="your-api-key"

# Test Configuration  
export TEST_DURATION="5m"
export TARGET_VUS="100"
export RAMP_UP_DURATION="2m"

# Monitoring Configuration
export INFLUXDB_URL="http://localhost:8086"
export INFLUXDB_DB="k6"
```

### 2. Configuration Files
Create environment-specific configuration files:

**config/development.json**
```json
{
  "baseUrl": "https://api-dev.example.com",
  "maxVUs": 50,
  "duration": "2m",
  "thresholds": {
    "http_req_duration": ["p(95)<1000"],
    "http_req_failed": ["rate<0.1"]
  }
}
```

**config/production.json**
```json
{
  "baseUrl": "https://api.example.com", 
  "maxVUs": 500,
  "duration": "10m",
  "thresholds": {
    "http_req_duration": ["p(95)<500"],
    "http_req_failed": ["rate<0.01"]
  }
}
```

## Test Options Configuration

### 1. Load Stages
Configure different load patterns:

```javascript
// Ramp-up pattern
stages: [
  { duration: '2m', target: 100 },  // Gradual ramp-up
  { duration: '5m', target: 100 },  // Steady state
  { duration: '2m', target: 0 },    // Ramp-down
]

// Spike pattern  
stages: [
  { duration: '1m', target: 10 },   // Normal load
  { duration: '30s', target: 500 }, // Sudden spike
  { duration: '1m', target: 10 },   // Back to normal
]

// Stress pattern
stages: [
  { duration: '5m', target: 100 },
  { duration: '5m', target: 200 },
  { duration: '5m', target: 400 },  // Beyond normal capacity
  { duration: '5m', target: 100 },
]
```

### 2. Thresholds Configuration
Set performance criteria:

```javascript
thresholds: {
  // Response time
  http_req_duration: [
    'p(50)<200',    // 50% under 200ms
    'p(95)<800',    // 95% under 800ms  
    'p(99)<1500',   // 99% under 1.5s
  ],
  
  // Error rates
  http_req_failed: ['rate<0.05'],  // Less than 5% errors
  
  // Throughput
  http_reqs: ['rate>50'],          // At least 50 req/s
  
  // Custom metrics
  login_duration: ['p(95)<3000'],  // Login under 3s
  checkout_success: ['rate>0.95'], // 95% checkout success
}
```

### 3. Output Configuration
Configure where test results go:

```javascript
// Send to InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 test.js

// Save to JSON
k6 run --out json=results.json test.js

// Multiple outputs
k6 run --out json=results.json --out influxdb=http://localhost:8086/k6 test.js
```

## Monitoring Configuration

### 1. InfluxDB Setup
Configure InfluxDB for metrics storage:

```bash
# Environment variables
INFLUXDB_DB=k6
INFLUXDB_USER=k6
INFLUXDB_PASSWORD=k6123
```

### 2. Grafana Configuration
Set up Grafana dashboards:

```yaml
# datasources/influxdb.yml
- name: InfluxDB
  type: influxdb
  url: http://influxdb:8086
  database: k6
  user: k6
  password: k6123
```

### 3. Custom Metrics
Define application-specific metrics:

```javascript
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

// Custom metrics
const loginAttempts = new Counter('login_attempts');
const activeUsers = new Gauge('active_users');
const loginSuccessRate = new Rate('login_success_rate');
const checkoutTime = new Trend('checkout_time');

export default function () {
  // Increment counters
  loginAttempts.add(1);
  
  // Set gauge values
  activeUsers.add(__VU);
  
  // Track rates
  const loginSuccess = performLogin();
  loginSuccessRate.add(loginSuccess);
  
  // Record trends
  const checkoutStart = Date.now();
  performCheckout();
  checkoutTime.add(Date.now() - checkoutStart);
}
```

## Network Configuration

### 1. HTTP Configuration
Configure HTTP client behavior:

```javascript
export const options = {
  http: {
    responseCallback: http.expectedStatuses(200, 201, 202),
  },
  
  // No connection reuse (more realistic)
  noConnectionReuse: false,
  
  // Custom user agent
  userAgent: 'K6LoadTest/1.0',
  
  // Timeout settings
  timeout: '60s',
};
```

### 2. TLS Configuration
Configure TLS/SSL settings:

```javascript
export const options = {
  tlsAuth: [
    {
      cert: open('./certs/client.crt'),
      key: open('./certs/client.key'),
    },
  ],
  
  // Skip TLS verification (for testing only)
  insecureSkipTLSVerify: true,
  
  // TLS version
  tlsVersion: {
    min: 'tls1.2',
    max: 'tls1.3',
  },
};
```

## CI/CD Configuration

### 1. GitHub Actions
Configure automated testing:

```yaml
# .github/workflows/k6-tests.yml
env:
  K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
  API_BASE_URL: ${{ secrets.API_BASE_URL }}
  
jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run k6 test
        run: k6 run tests/load-test.js
```

### 2. Environment Secrets
Store sensitive configuration:

```bash
# GitHub Secrets
API_KEY=your-secret-api-key
DATABASE_URL=your-database-connection
K6_CLOUD_TOKEN=your-k6-cloud-token
```

## Advanced Configuration

### 1. Scenario Configuration
Define complex test scenarios:

```javascript
export const options = {
  scenarios: {
    smoke_test: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
      tags: { test_type: 'smoke' },
    },
    
    load_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '5m', target: 100 },
        { duration: '10m', target: 100 },
        { duration: '5m', target: 0 },
      ],
      tags: { test_type: 'load' },
    },
    
    stress_test: {
      executor: 'ramping-arrival-rate',
      startRate: 50,
      timeUnit: '1s',
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 50 },
      ],
      tags: { test_type: 'stress' },
    },
  },
};
```

### 2. Data Configuration
Configure test data management:

```javascript
// External data files
const users = JSON.parse(open('./data/users.json'));
const products = JSON.parse(open('./data/products.json'));

// Parameterized data
export function setup() {
  // Initialize test data
  return {
    users: generateUsers(100),
    apiKey: __ENV.API_KEY,
  };
}

export default function (data) {
  const user = data.users[__VU % data.users.length];
  // Use user in test
}
```

### 3. Resource Optimization
Configure resource usage:

```javascript
export const options = {
  // Batch requests
  batch: 10,
  
  // DNS configuration
  dns: {
    ttl: '1m',
    select: 'first',
    policy: 'preferIPv4',
  },
  
  // Memory limits
  setupTimeout: '60s',
  teardownTimeout: '60s',
};
```
