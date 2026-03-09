# Aziosxjs

A modern, lightweight HTTP client for Node.js designed for performance, extensibility, and clarity.

Aziosxjs provides a clean API for making HTTP requests while exposing a modular request pipeline architecture.
It is built directly on Node.js low-level `http` and `https` modules to demonstrate how production-grade HTTP clients work internally.

The goal of this project is to provide a simple but powerful HTTP client that supports advanced features such as retries, caching, request deduplication, and rate limiting.

---

# Features

### Core HTTP

* Promise-based HTTP requests
* Support for GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
* Automatic JSON parsing
* Automatic request body serialization
* Query parameter serialization

### Request Pipeline

* Request interceptors
* Response interceptors
* Structured error system
* AbortController cancellation support

### Performance Features

* Automatic retry system
* Exponential backoff strategy
* Request deduplication (prevents duplicate concurrent requests)
* Response caching
* Built-in rate limiting

### Developer Experience

* TypeScript support
* Modular architecture
* Lightweight dependency-free implementation

---

# Installation

```bash id="x0c2qz"
npm install aziosxjs
```

---

# Quick Example

```javascript id="xgqz2e"
import azios from "aziosxjs";

async function getUsers() {
  const response = await azios.get(
    "https://jsonplaceholder.typicode.com/users"
  );

  console.log(response.data);
}

getUsers();
```

---

# Basic Usage

## GET Request

```javascript id="q2s48a"
const res = await azios.get("https://api.example.com/users");

console.log(res.data);
```

---

## POST Request

```javascript id="ys8fr0"
const res = await azios.post(
  "https://api.example.com/login",
  {
    username: "user",
    password: "password"
  }
);

console.log(res.data);
```

---

# Query Parameters

Aziosxjs automatically serializes query parameters.

```javascript id="6e6w1q"
const res = await azios.get(
  "https://jsonplaceholder.typicode.com/posts",
  {
    params: { _limit: 2 }
  }
);

console.log(res.data);
```

Generated URL:

```id="2dq3rc"
/posts?_limit=2
```

---

# Interceptors

Interceptors allow you to modify requests or responses globally.

## Request Interceptor

```javascript id="o7j8rz"
azios.interceptors.request.use(config => {
  console.log("Request intercepted");

  if (!config.headers) config.headers = {};
  config.headers["x-client"] = "aziosxjs";

  return config;
});
```

---

## Response Interceptor

```javascript id="w7r0uj"
azios.interceptors.response.use(response => {
  console.log("Response intercepted");
  return response;
});
```

---

# Request Cancellation

Requests can be cancelled using `AbortController`.

```javascript id="68f4s3"
const controller = new AbortController();

azios.get(
  "https://jsonplaceholder.typicode.com/users",
  { signal: controller.signal }
);

controller.abort();
```

If aborted, Aziosxjs throws an error with code:

```id="m5ktg3"
ABORTED
```

---

# Retry System

Aziosxjs can automatically retry failed requests.

```javascript id="zwdg7p"
await azios.get("https://api.example.com/users", {
  retry: 3
});
```

Retries use **exponential backoff** to avoid overwhelming servers.

---

# Response Caching

Responses can be cached in memory.

```javascript id="hjbrgx"
await azios.get(
  "https://api.example.com/users",
  { cache: true }
);
```

Subsequent requests may return cached responses instantly.

---

# Rate Limiting

Control the number of concurrent requests.

```javascript id="m2l4x9"
await azios.get(
  "https://api.example.com/users",
  { rateLimit: 3 }
);
```

Only 3 requests will execute simultaneously.

---

# Error Handling

Aziosxjs returns standardized error objects.

```javascript id="n2d3kr"
try {
  await azios.get("https://invalid-url.test");
} catch (error) {
  console.log(error.name); // AziosError
  console.log(error.code); // NETWORK_ERROR
}
```

This makes debugging significantly easier.

---

# Request Pipeline Architecture

Aziosxjs follows a modular pipeline design.

```id="m2b3ux"
User Code
   ↓
Azios Instance
   ↓
Request Interceptors
   ↓
Retry Engine
   ↓
Rate Limiter
   ↓
dispatchRequest (HTTP engine)
   ↓
Node.js http / https
   ↓
Response Interceptors
   ↓
Return Response
```

---

# Project Structure

```id="v2z3go"
src
 ├── core
 │    ├── Azios.ts
 │    ├── createInstance.ts
 │    ├── dispatchRequest.ts
 │    └── requestStore.ts
 │
 ├── cache
 │    └── memoryCache.ts
 │
 ├── rateLimiter
 │    └── rateLimiter.ts
 │
 ├── interceptors
 │    └── InterceptorManager.ts
 │
 ├── errors
 │    └── AziosError.ts
 │
 ├── helpers
 │    └── buildURL.ts
 │
 ├── types
 │    ├── config.ts
 │    ├── request.ts
 │    └── response.ts
 │
 └── index.ts
```

---

# Version Roadmap

### v0.1

* Core HTTP client
* Instances
* JSON handling
* Request configuration

### v0.2

* Interceptor pipeline
* Structured error system
* Request cancellation
* Query parameter serialization

### v0.3

* Retry mechanism
* Exponential backoff
* Request deduplication

### v0.4

* Response caching
* Rate limiting

### Planned

* Plugin system
* Middleware pipeline
* Advanced TypeScript inference
* Universal runtime support (Node, Browser, Edge)

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

# Author

Azeem Ali

---

# License

MIT
