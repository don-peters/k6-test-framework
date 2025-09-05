import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  // Test JSONPlaceholder API - Get all posts
  const postsResponse = http.get('https://jsonplaceholder.typicode.com/posts');
  
  check(postsResponse, {
    'GET /posts status is 200': (r) => r.status === 200,
    'GET /posts response time < 500ms': (r) => r.timings.duration < 500,
    'GET /posts has posts': (r) => {
      const posts = JSON.parse(r.body);
      return Array.isArray(posts) && posts.length > 0;
    },
  });

  // Test individual post
  const postResponse = http.get('https://jsonplaceholder.typicode.com/posts/1');
  
  check(postResponse, {
    'GET /posts/1 status is 200': (r) => r.status === 200,
    'GET /posts/1 response time < 300ms': (r) => r.timings.duration < 300,
    'GET /posts/1 has correct structure': (r) => {
      const post = JSON.parse(r.body);
      return post.id === 1 && post.title && post.body && post.userId;
    },
  });

  // Test POST request
  const newPost = {
    title: 'Load Test Post',
    body: 'This is a test post created during load testing',
    userId: 1,
  };

  const createResponse = http.post(
    'https://jsonplaceholder.typicode.com/posts',
    JSON.stringify(newPost),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  check(createResponse, {
    'POST /posts status is 201': (r) => r.status === 201,
    'POST /posts response time < 1000ms': (r) => r.timings.duration < 1000,
    'POST /posts returns created post': (r) => {
      const created = JSON.parse(r.body);
      return created.title === newPost.title && created.id;
    },
  });

  sleep(1);
}
