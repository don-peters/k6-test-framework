import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 20 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.1'],
  },
  tags: {
    testType: 'api-comparison',
  },
};

const APIs = {
  jsonplaceholder: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    endpoints: ['/posts', '/users', '/comments', '/todos']
  },
  httpbin: {
    baseUrl: 'https://httpbin.org',
    endpoints: ['/get', '/uuid', '/json', '/headers']
  },
  reqres: {
    baseUrl: 'https://reqres.in/api',
    endpoints: ['/users', '/users/2', '/unknown', '/unknown/2']
  },
  catfacts: {
    baseUrl: 'https://catfact.ninja',
    endpoints: ['/fact', '/breeds', '/facts']
  }
};

export default function () {
  const apiNames = Object.keys(APIs);
  const selectedAPI = apiNames[Math.floor(Math.random() * apiNames.length)];
  const api = APIs[selectedAPI];
  
  const endpoint = api.endpoints[Math.floor(Math.random() * api.endpoints.length)];
  const url = `${api.baseUrl}${endpoint}`;
  
  console.log(`Testing ${selectedAPI}: ${url}`);
  
  const response = http.get(url, {
    tags: { api: selectedAPI, endpoint: endpoint }
  });
  
  check(response, {
    [`${selectedAPI}: status is 200`]: (r) => r.status === 200,
    [`${selectedAPI}: response time OK`]: (r) => r.timings.duration < 2000,
    [`${selectedAPI}: has content`]: (r) => r.body && r.body.length > 0,
    [`${selectedAPI}: is JSON`]: (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    }
  });
  
  // Test specific API behaviors
  switch (selectedAPI) {
    case 'jsonplaceholder':
      testJSONPlaceholder(api.baseUrl);
      break;
    case 'httpbin':
      testHTTPBin(api.baseUrl);
      break;
    case 'reqres':
      testReqRes(api.baseUrl);
      break;
    case 'catfacts':
      testCatFacts(api.baseUrl);
      break;
  }
  
  sleep(1);
}

function testJSONPlaceholder(baseUrl) {
  // Test CRUD operations
  const newPost = {
    title: 'K6 Test Post',
    body: 'Testing POST operation',
    userId: 1
  };
  
  const postResponse = http.post(`${baseUrl}/posts`, JSON.stringify(newPost), {
    headers: { 'Content-Type': 'application/json' },
    tags: { operation: 'create', api: 'jsonplaceholder' }
  });
  
  check(postResponse, {
    'JSONPlaceholder POST: created': (r) => r.status === 201,
    'JSONPlaceholder POST: returns ID': (r) => JSON.parse(r.body).id !== undefined
  });
}

function testHTTPBin(baseUrl) {
  // Test different HTTP methods
  const postData = { test: 'data', timestamp: Date.now() };
  
  const postResponse = http.post(`${baseUrl}/post`, JSON.stringify(postData), {
    headers: { 'Content-Type': 'application/json' },
    tags: { operation: 'post', api: 'httpbin' }
  });
  
  check(postResponse, {
    'HTTPBin POST: success': (r) => r.status === 200,
    'HTTPBin POST: echoes data': (r) => {
      const body = JSON.parse(r.body);
      return body.json && body.json.test === 'data';
    }
  });
  
  // Test PUT
  const putResponse = http.put(`${baseUrl}/put`, JSON.stringify(postData), {
    headers: { 'Content-Type': 'application/json' },
    tags: { operation: 'put', api: 'httpbin' }
  });
  
  check(putResponse, {
    'HTTPBin PUT: success': (r) => r.status === 200
  });
}

function testReqRes(baseUrl) {
  // Test user operations
  const newUser = {
    name: 'K6 Test User',
    job: 'Performance Tester'
  };
  
  const createResponse = http.post(`${baseUrl}/users`, JSON.stringify(newUser), {
    headers: { 'Content-Type': 'application/json' },
    tags: { operation: 'create_user', api: 'reqres' }
  });
  
  check(createResponse, {
    'ReqRes CREATE: success': (r) => r.status === 201,
    'ReqRes CREATE: returns user': (r) => {
      const user = JSON.parse(r.body);
      return user.name === newUser.name && user.id;
    }
  });
}

function testCatFacts(baseUrl) {
  // Test fact validation
  const factResponse = http.get(`${baseUrl}/fact`, {
    tags: { operation: 'get_fact', api: 'catfacts' }
  });
  
  check(factResponse, {
    'CatFacts: has fact': (r) => {
      const fact = JSON.parse(r.body);
      return fact.fact && fact.fact.length > 10; // Facts should be meaningful
    },
    'CatFacts: has length': (r) => {
      const fact = JSON.parse(r.body);
      return fact.length > 0;
    }
  });
}
