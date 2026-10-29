import { describe, expect, test, setDefaultTimeout } from "bun:test";

setDefaultTimeout(15000);
const endpoint = "https://api.producthunt.com/v2/api/graphql";
const token = process.env.PRODUCTHUNT_DEVELOPER_TOKEN;

const query = `
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

describe("Product Hunt GraphQL API", () => {
  test("1. API returns a successful HTTP response", async () => {
    expect(token).toBeTruthy();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    expect(response.status).toBe(200);
  });

  test("2. Response contains JSON data", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    expect(response.headers.get("content-type")).toContain(
      "application/json"
    );

    const body = await response.json();
    expect(body).toHaveProperty("data");
  });

  test("3. Posts connection is returned", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const body = await response.json();

    expect(body.errors).toBeUndefined();
    expect(body.data.posts.edges).toBeInstanceOf(Array);
  });

  test("4. Returned posts contain IDs and names", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const body = await response.json();
    const posts = body.data.posts.edges;

    expect(posts.length).toBeGreaterThan(0);

    for (const edge of posts) {
      expect(edge.node.id).toBeTruthy();
      expect(edge.node.name).toBeTruthy();
    }
  });

  test("5. Invalid GraphQL field returns an error", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "{ invalidFieldForTesting }",
      }),
    });

    const body = await response.json();

    expect(body.errors).toBeTruthy();
    expect(body.errors.length).toBeGreaterThan(0);
  });

  test("6. Missing authorization is rejected", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    expect([401, 403]).toContain(response.status);
  });

  test("7. Invalid GraphQL syntax returns an error", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "query {" }),
    });

    const body = await response.json();

    expect(body.errors).toBeTruthy();
    expect(body.errors.length).toBeGreaterThan(0);
  });

  test("8. Requesting multiple posts respects the limit", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    const posts = body.data.posts.edges;

    expect(body.errors).toBeUndefined();
    expect(posts.length).toBeLessThanOrEqual(3);
  });
});
