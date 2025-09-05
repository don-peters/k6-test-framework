import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 1 },
    { duration: '30s', target: 1 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
  tags: {
    testType: 'smoke',
    api: 'multiple',
  },
};

export default function () {
  console.log('Starting smoke test suite...');

  // Test 1: JSONPlaceholder - Basic functionality
  console.log('Testing JSONPlaceholder API...');
  const jsonResponse = http.get('https://jsonplaceholder.typicode.com/posts/1');
  
  check(jsonResponse, {
    'JSONPlaceholder: status is 200': (r) => r.status === 200,
    'JSONPlaceholder: response time < 2s': (r) => r.timings.duration < 2000,
    'JSONPlaceholder: has post data': (r) => {
      const post = JSON.parse(r.body);
      return post.id && post.title && post.body;
    },
  });

  // Test 2: httpbin - HTTP methods
  console.log('Testing httpbin API...');
  const httpbinResponse = http.get('https://httpbin.org/get');
  
  check(httpbinResponse, {
    'httpbin: GET status is 200': (r) => r.status === 200,
    'httpbin: GET response time < 2s': (r) => r.timings.duration < 2000,
    'httpbin: GET returns correct data': (r) => {
      const data = JSON.parse(r.body);
      return data.url === 'https://httpbin.org/get';
    },
  });

  // Test 3: ReqRes - User API
  console.log('Testing ReqRes API...');
  const reqresResponse = http.get('https://reqres.in/api/users/1');
  
  check(reqresResponse, {
    'ReqRes: status is 200': (r) => r.status === 200,
    'ReqRes: response time < 2s': (r) => r.timings.duration < 2000,
    'ReqRes: has user data': (r) => {
      const response = JSON.parse(r.body);
      return response.data && response.data.id === 1;
    },
  });

  // Test 4: Cat Facts - Simple API
  console.log('Testing Cat Facts API...');
  const catResponse = http.get('https://catfact.ninja/fact');
  
  check(catResponse, {
    'Cat Facts: status is 200': (r) => r.status === 200,
    'Cat Facts: response time < 2s': (r) => r.timings.duration < 2000,
    'Cat Facts: has fact data': (r) => {
      const fact = JSON.parse(r.body);
      return fact.fact && fact.length;
    },
  });

  console.log('Smoke test suite completed');
}
