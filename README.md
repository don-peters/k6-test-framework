# K6 Performance Testing Framework

A comprehensive k6 testing framework with TypeScript support, Grafana dashboards, and CI/CD integration for testing public APIs.

## 🚀 Features

- **TypeScript Support**: Write tests with full type safety
- **Grafana Dashboards**: Real-time monitoring and visualization  
- **k6 Cloud Integration**: Advanced analytics and team collaboration
- **CI/CD Integration**: Automated testing with GitHub Actions
- **Multiple Environments**: Dev, staging, and production configurations
- **Best Practices**: Following k6 performance testing guidelines
- **Public API Examples**: Ready-to-use tests for popular free APIs
- **Docker Optional**: Works with or without Docker

## 📁 Project Structure

```
k6-test-framework/
├── tests/                  # Test scripts
│   ├── api/               # API-specific tests
│   ├── load/              # Load testing scenarios  
│   ├── stress/            # Stress testing scenarios
│   └── spike/             # Spike testing scenarios
├── config/                # Environment configurations
├── dashboards/            # Grafana dashboard definitions
├── scripts/               # Utility scripts
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD pipelines
└── results/               # Test results and reports
```

## 🔧 Prerequisites

### Required Software
1. **[k6](https://k6.io/docs/getting-started/installation/)** - Performance testing tool ✅ **REQUIRED**
   - macOS: `brew install k6`
   - Ubuntu/Debian: See [installation guide](./docs/installation.md)
   - Windows: `choco install k6`

2. **[Node.js](https://nodejs.org/)** - For npm scripts ✅ **REQUIRED**
   - Version 16+ recommended

3. **[Docker](https://docs.docker.com/get-docker/)** - For monitoring stack ⚠️ **OPTIONAL**
   - Only needed for Grafana dashboards
   - Tests run perfectly without Docker!

## 🏃‍♂️ Quick Start

### 1. Initial Setup
```bash
# Clone or download this repository
# cd k6-test-framework

# Install npm dependencies
npm install

# Make scripts executable (Linux/macOS)
chmod +x scripts/*.sh
```

### 2. Run Tests (No Docker Required!)
```bash
# Simple test - works immediately
k6 run tests/samples/basic-test.js

# Or use npm scripts
npm run test:sample   # Basic API test
npm run test:smoke    # Smoke test across multiple APIs
npm run test:load     # Load test (will save to console only)
npm run test:stress   # Stress test
npm run test:spike    # Spike test
```

### 3. Optional: Enhanced Monitoring with Docker
If you want real-time Grafana dashboards:
```bash
# Start monitoring stack (requires Docker)
npm run monitoring:up

# Run tests with dashboard output
k6 run --out influxdb=http://localhost:8086/k6 tests/load/api-load-test.js

# Access Grafana at http://localhost:3000 (admin/admin)
```

### 4. Optional: k6 Cloud Integration
For advanced analytics and team collaboration:
```bash
# Login to k6 Cloud (free account required)
k6 cloud login

# Run tests in k6 Cloud infrastructure
npm run test:cloud:smoke   # Cloud execution
npm run test:cloud:load    # Scalable load testing

# Or stream results to cloud while running locally
npm run test:hybrid:smoke  # Local execution + cloud analytics
```
```

### 4. View Results
**Without Docker:**
- **Console Output**: Real-time metrics in terminal ✅
- **JSON Files**: Saved results in `results/` directory ✅

**With Docker (optional):**
- **Grafana Dashboard**: http://localhost:3000 (admin/admin) 📊
- **Real-time Charts**: Live performance visualization 📈

## 📊 Grafana Dashboards

Access dashboards at `http://localhost:3000` (admin/admin):
- **K6 Load Testing Results**: Real-time test metrics
- **API Performance Overview**: Response times, throughput, errors
- **Infrastructure Monitoring**: System resources during tests

## 🎯 Recommended Free APIs for Testing

### 1. JSONPlaceholder (REST API)
- **URL**: `https://jsonplaceholder.typicode.com`
- **Features**: CRUD operations, realistic data
- **Rate Limit**: None
- **Best for**: Basic REST API testing

### 2. httpbin (HTTP Testing)
- **URL**: `https://httpbin.org`
- **Features**: HTTP methods, status codes, headers
- **Rate Limit**: None  
- **Best for**: HTTP protocol testing

### 3. ReqRes (Mock API)
- **URL**: `https://reqres.in`
- **Features**: User management, authentication simulation
- **Rate Limit**: None
- **Best for**: Authentication flows

### 4. OpenWeatherMap API (Weather)
- **URL**: `https://api.openweathermap.org`
- **Features**: Weather data, geolocation
- **Rate Limit**: 1000 calls/day (free tier)
- **Best for**: Real-world API simulation

### 5. Cat Facts API
- **URL**: `https://catfact.ninja`
- **Features**: Random cat facts
- **Rate Limit**: None
- **Best for**: Simple GET requests

## 📈 Test Scenarios

- **Smoke Tests**: Basic functionality verification
- **Load Tests**: Normal expected load
- **Stress Tests**: Breaking point identification  
- **Spike Tests**: Sudden load increase handling
- **Volume Tests**: Large amounts of data

## 🔨 Development

### Writing Tests
```typescript
import http from 'k6/http';
import { check } from 'k6';
import { Options } from 'k6/options';

export const options: Options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const response = http.get('https://api.example.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## 🚀 Deployment

Tests can be run in various environments:
- Local development
- CI/CD pipelines  
- k6 Cloud (with account)
- Self-hosted infrastructure

## 📚 Documentation

- [Writing Effective Tests](./docs/writing-tests.md)
- [Configuration Guide](./docs/configuration.md)
- [Dashboard Setup](./docs/dashboards.md)
- [CI/CD Setup](./docs/cicd.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details
