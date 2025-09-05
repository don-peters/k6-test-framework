import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 200 },  // Increase to 200 users
    { duration: '2m', target: 300 },  // Push to 300 users
    { duration: '5m', target: 300 },  // Stay at 300 users
    { duration: '2m', target: 200 },  // Scale back
    { duration: '5m', target: 100 },  // Scale back further
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // More lenient for stress test
    http_req_failed: ['rate<0.2'],      // Allow higher error rate
  },
  tags: {
    testType: 'stress',
    api: 'httpbin',
  },
};

export default function () {
  // Test various HTTP methods under stress
  const testCases = [
    () => http.get('https://httpbin.org/get'),
    () => http.post('https://httpbin.org/post', JSON.stringify({ test: 'data' }), {
      headers: { 'Content-Type': 'application/json' }
    }),
    () => http.put('https://httpbin.org/put', JSON.stringify({ update: 'data' }), {
      headers: { 'Content-Type': 'application/json' }
    }),
    () => http.delete('https://httpbin.org/delete'),
    () => http.get('https://httpbin.org/delay/1'), // Simulate slow endpoint
  ];

  // Randomly select a test case
  const testCase = testCases[Math.floor(Math.random() * testCases.length)];
  const response = testCase();

  check(response, {
    'stress test status is successful': (r) => r.status >= 200 && r.status < 400,
    'stress test response time < 5s': (r) => r.timings.duration < 5000,
    'stress test response body exists': (r) => r.body && r.body.length > 0,
  });

  // Simulate varying user behavior under stress
  sleep(Math.random() * 3);
}
