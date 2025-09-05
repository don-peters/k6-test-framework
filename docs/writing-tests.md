# Writing Effective K6 Tests

This guide covers best practices for writing effective performance tests with k6.

## Test Structure

### 1. Test Organization
- **Smoke Tests**: Basic functionality verification with minimal load
- **Load Tests**: Normal expected load to validate performance under typical conditions
- **Stress Tests**: Above-normal load to find breaking points
- **Spike Tests**: Sudden load increases to test recovery
- **Volume Tests**: Large amounts of data processing

### 2. File Organization
```
tests/
├── smoke/       # Quick verification tests
├── load/        # Normal load scenarios
├── stress/      # High load scenarios
├── spike/       # Sudden load changes
└── volume/      # Large data tests
```

## Test Writing Best Practices

### 1. Options Configuration
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at load
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% under 1s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
    http_reqs: ['rate>50'],            // Min 50 req/s
  },
  tags: {
    testType: 'load',
    api: 'jsonplaceholder',
  },
};
```

### 2. Effective Checks
```javascript
check(response, {
  'status is 200': (r) => r.status === 200,
  'response time OK': (r) => r.timings.duration < 1000,
  'body has data': (r) => r.body && r.body.length > 0,
  'content type is JSON': (r) => 
    r.headers['Content-Type'].includes('application/json'),
});
```

### 3. Data-Driven Testing
```javascript
const testData = [
  { endpoint: '/posts', expectedStatus: 200 },
  { endpoint: '/users', expectedStatus: 200 },
  { endpoint: '/invalid', expectedStatus: 404 },
];

export default function () {
  testData.forEach(data => {
    const response = http.get(`${baseURL}${data.endpoint}`);
    check(response, {
      [`${data.endpoint} has correct status`]: (r) => 
        r.status === data.expectedStatus,
    });
  });
}
```

### 4. Realistic User Simulation
```javascript
export default function () {
  // Authenticate
  const loginResponse = http.post('/login', credentials);
  const token = loginResponse.json('token');
  
  // Browse products
  http.get('/products', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  sleep(2); // User think time
  
  // View product details
  const productId = Math.floor(Math.random() * 100) + 1;
  http.get(`/products/${productId}`);
  
  sleep(1);
  
  // Add to cart (30% probability)
  if (Math.random() < 0.3) {
    http.post('/cart', { productId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
```

## Performance Metrics

### Key Metrics to Monitor
1. **Response Time**: p50, p95, p99 percentiles
2. **Throughput**: Requests per second
3. **Error Rate**: Percentage of failed requests
4. **Concurrent Users**: Virtual user count
5. **Data Transfer**: Bytes sent/received

### Setting Thresholds
```javascript
thresholds: {
  // Response time thresholds
  http_req_duration: [
    'p(50)<200',   // 50% under 200ms
    'p(95)<500',   // 95% under 500ms
    'p(99)<1000',  // 99% under 1s
  ],
  
  // Error rate thresholds  
  http_req_failed: ['rate<0.05'], // Under 5% errors
  
  // Throughput thresholds
  http_reqs: ['rate>100'], // At least 100 req/s
  
  // Custom checks
  'login success': ['rate>0.95'], // 95% login success
},
```

## Common Patterns

### 1. Authentication Flow
```javascript
function authenticate() {
  const response = http.post('/auth/login', {
    username: 'testuser',
    password: 'testpass'
  });
  
  check(response, {
    'login successful': (r) => r.status === 200,
    'token received': (r) => r.json('token') !== undefined,
  });
  
  return response.json('token');
}
```

### 2. Error Handling
```javascript
const response = http.get(url);

if (response.status !== 200) {
  console.error(`Request failed: ${response.status} ${response.status_text}`);
  return;
}

try {
  const data = JSON.parse(response.body);
  // Process data
} catch (e) {
  console.error(`JSON parse error: ${e.message}`);
}
```

### 3. Rate Limiting Handling
```javascript
const response = http.get(url);

if (response.status === 429) { // Too Many Requests
  const retryAfter = parseInt(response.headers['Retry-After']) || 1;
  console.warn(`Rate limited, waiting ${retryAfter}s`);
  sleep(retryAfter);
  return;
}
```

## Debugging Tips

### 1. Enable Verbose Logging
```bash
k6 run --verbose tests/load/api-load-test.js
```

### 2. Use Console Logging Strategically
```javascript
console.log(`VU ${__VU}, Iteration ${__ITER}: Testing ${url}`);
```

### 3. Capture Response Details
```javascript
if (response.status !== 200) {
  console.error(`Error details:`, {
    status: response.status,
    body: response.body.substring(0, 200),
    url: response.url,
    timings: response.timings,
  });
}
```

## Performance Optimization

### 1. Minimize Resource Usage
- Use `sleep()` to simulate realistic user behavior
- Don't parse JSON unless necessary
- Reuse connections when possible
- Use lightweight checks

### 2. Efficient Data Generation
```javascript
// Good: Generate data once
const testData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
}));

export default function () {
  const user = testData[__VU % testData.length];
  // Use user data
}
```

### 3. Smart Parameterization
```javascript
// Use environment variables
const baseURL = __ENV.BASE_URL || 'https://api.example.com';
const testDuration = __ENV.TEST_DURATION || '5m';
const targetVUs = parseInt(__ENV.TARGET_VUS) || 100;
```
