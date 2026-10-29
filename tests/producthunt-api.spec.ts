import dotenv from 'dotenv';
import path from 'path';
import { test, expect } from '@playwright/test';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const endpoint = 'https://api.producthunt.com/v2/api/graphql';

const token = process.env.PRODUCTHUNT_DEVELOPER_TOKEN;

const query = `
  query {
    posts(first: 1) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

test.describe('Product Hunt GraphQL API', () => {
  test.beforeEach(() => {
    expect(token, 'Developer token must be configured in .env').toBeTruthy();
  });

  test('1. API returns a successful HTTP response', async ({ request }) => {
    const response = await request.post(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query },
    });

    expect(response.status()).toBe(200);
  });

  test('2. Response contains JSON data', async ({ request }) => {
    const response = await request.post(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query },
    });

    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body).toHaveProperty('data');
  });

  test('3. Posts connection is returned', async ({ request }) => {
    const response = await request.post(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query },
    });

    const body = await response.json();

    expect(body.errors).toBeUndefined();
    expect(body.data.posts).toBeTruthy();
    expect(Array.isArray(body.data.posts.edges)).toBe(true);
  });

  test('4. Post has an ID and name', async ({ request }) => {
    const response = await request.post(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query },
    });

    const body = await response.json();
    const posts = body.data.posts.edges;

    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].node.id).toBeTruthy();
    expect(posts[0].node.name).toBeTruthy();
  });

  test('5. Invalid GraphQL field returns an error', async ({ request }) => {
    const response = await request.post(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: '{ invalidFieldForTesting }' },
    });

    const body = await response.json();

    expect(body.errors).toBeTruthy();
    expect(body.errors.length).toBeGreaterThan(0);
  });
  test('6. Missing authorization token is rejected', async ({ request }) => {
    const response = await request.post(endpoint, {
      data: { query },
    });

    expect([401, 403]).toContain(response.status());
  });

  test('7. Invalid GraphQL syntax returns an error', async ({ request }) => {
    const response = await request.post(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: 'query {' },
    });

    const body = await response.json();

    expect(body.errors).toBeTruthy();
    expect(body.errors.length).toBeGreaterThan(0);
  });

  test('8. Requesting multiple posts returns the expected structure', async ({ request }) => {
    const multiplePostsQuery = `
      query {
        posts(first: 3) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `;

    const response = await request.post(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: multiplePostsQuery },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.errors).toBeUndefined();
    expect(body.data.posts.edges.length).toBeLessThanOrEqual(3);

    for (const edge of body.data.posts.edges) {
      expect(edge.node.id).toBeTruthy();
      expect(edge.node.name).toBeTruthy();
    }
  });
});
