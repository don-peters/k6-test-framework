// Environment configurations for different testing scenarios

export interface TestConfig {
  baseUrl: string;
  timeout: number;
  thresholds: {
    http_req_duration: string[];
    http_req_failed: string[];
    http_reqs: string[];
  };
  stages: Array<{
    duration: string;
    target: number;
  }>;
}

export const configs = {
  development: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    timeout: 30000,
    thresholds: {
      http_req_duration: ['p(95)<500'],
      http_req_failed: ['rate<0.05'],
      http_reqs: ['rate>10'],
    },
    stages: [
      { duration: '1m', target: 10 },
      { duration: '2m', target: 10 },
      { duration: '1m', target: 0 },
    ],
  },
  
  staging: {
    baseUrl: 'https://httpbin.org',
    timeout: 30000,
    thresholds: {
      http_req_duration: ['p(95)<1000'],
      http_req_failed: ['rate<0.1'],
      http_reqs: ['rate>50'],
    },
    stages: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 50 },
      { duration: '2m', target: 0 },
    ],
  },
  
  production: {
    baseUrl: 'https://reqres.in/api',
    timeout: 30000,
    thresholds: {
      http_req_duration: ['p(95)<2000'],
      http_req_failed: ['rate<0.01'],
      http_reqs: ['rate>100'],
    },
    stages: [
      { duration: '5m', target: 100 },
      { duration: '10m', target: 100 },
      { duration: '5m', target: 0 },
    ],
  },

  smoke: {
    baseUrl: 'https://catfact.ninja',
    timeout: 30000,
    thresholds: {
      http_req_duration: ['p(95)<2000'],
      http_req_failed: ['rate<0.01'],
    },
    stages: [
      { duration: '30s', target: 1 },
      { duration: '30s', target: 1 },
      { duration: '30s', target: 0 },
    ],
  },

  stress: {
    baseUrl: 'https://httpbin.org',
    timeout: 30000,
    thresholds: {
      http_req_duration: ['p(95)<5000'],
      http_req_failed: ['rate<0.2'],
    },
    stages: [
      { duration: '2m', target: 100 },
      { duration: '5m', target: 200 },
      { duration: '2m', target: 300 },
      { duration: '5m', target: 300 },
      { duration: '2m', target: 200 },
      { duration: '5m', target: 100 },
      { duration: '2m', target: 0 },
    ],
  },

  spike: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    timeout: 30000,
    thresholds: {
      http_req_duration: ['p(95)<10000'],
      http_req_failed: ['rate<0.5'],
    },
    stages: [
      { duration: '1m', target: 10 },
      { duration: '30s', target: 500 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 0 },
    ],
  },
} as const;

export type Environment = keyof typeof configs;
