import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.1'],
    http_reqs: ['rate>50'],
  },
  tags: {
    testType: 'load',
    api: 'jsonplaceholder',
  },
};

export default function () {
  // Test multiple endpoints with realistic load
  const endpoints = [
    '/posts',
    '/comments', 
    '/albums',
    '/photos',
    '/todos',
    '/users'
  ];

  // Randomly select an endpoint to test
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const response = http.get(`https://jsonplaceholder.typicode.com${endpoint}`);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
    'response has data': (r) => {
      const data = JSON.parse(r.body);
      return Array.isArray(data) && data.length > 0;
    },
  });

  // Test specific resource by ID (1-10)
  const resourceId = Math.floor(Math.random() * 10) + 1;
  const specificResponse = http.get(`https://jsonplaceholder.typicode.com${endpoint}/${resourceId}`);

  check(specificResponse, {
    'specific resource status is 200': (r) => r.status === 200,
    'specific resource response time < 500ms': (r) => r.timings.duration < 500,
    'specific resource has ID': (r) => {
      const resource = JSON.parse(r.body);
      return resource.id === resourceId;
    },
  });

  // Simulate user think time
  sleep(Math.random() * 2 + 1);
}
