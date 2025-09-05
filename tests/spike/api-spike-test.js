import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Normal load
    { duration: '30s', target: 500 }, // Spike to 500 users quickly
    { duration: '1m', target: 10 },   // Return to normal
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'], // Very lenient for spike test
    http_req_failed: ['rate<0.5'],      // Allow high error rate during spike
  },
  tags: {
    testType: 'spike',
    api: 'jsonplaceholder',
  },
};

export default function () {
  // Test how the API handles sudden load spikes
  const endpoints = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/users',
    'https://jsonplaceholder.typicode.com/todos',
  ];

  const url = endpoints[Math.floor(Math.random() * endpoints.length)];
  const response = http.get(url);

  check(response, {
    'spike test: request completed': (r) => r.status !== 0,
    'spike test: not timeout': (r) => r.status !== 'timeout',
    'spike test: response received': (r) => r.body !== null,
  });

  // Minimal sleep to simulate rapid requests during spike
  sleep(0.1);
}
