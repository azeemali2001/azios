# Aziosxjs

A lightweight HTTP client for Node.js inspired by Axios.

Aziosxjs provides a clean and minimal API for making HTTP requests while exposing the internal request pipeline architecture. It is built using Node.js low-level `http` and `https` modules to demonstrate how modern HTTP client libraries work internally.

This project focuses on simplicity, extensibility, and educational value while still providing practical features.

---

## Features

* Simple and clean API
* Promise-based HTTP requests
* Built using low-level Node.js `http` and `https` modules
* Request and response interceptors
* Structured error system
* Request cancellation support
* Query parameter serialization
* Automatic JSON parsing
* TypeScript support
* Modular architecture

---

## Installation

```bash
npm install aziosxjs
```

---

## Quick Example

```javascript
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

```javascript
const res = await azios.get("https://api.example.com/users");

console.log(res.data);
```

---

## POST Request

```javascript
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

Azios automatically serializes query parameters.

```javascript
const res = await azios.get(
  "https://jsonplaceholder.typicode.com/posts",
  {
    params: { _limit: 2 }
  }
);

console.log(res.data);
```

Generated URL:

```
/posts?_limit=2
```

---

# Interceptors

Interceptors allow you to modify requests or responses globally.

## Request Interceptor

```javascript
azios.interceptors.request.use(config => {
  console.log("Request intercepted");

  if (!config.headers) config.headers = {};
  config.headers["x-test"] = "azios";

  return config;
});
```

---

## Response Interceptor

```javascript
azios.interceptors.response.use(response => {
  console.log("Response intercepted");
  return response;
});
```

---

# Request Cancellation

Azios supports request cancellation using `AbortController`.

```javascript
const controller = new AbortController();

azios.get(
  "https://jsonplaceholder.typicode.com/users",
  { signal: controller.signal }
);

controller.abort();
```

When aborted, Azios throws a structured error with code:

```
ABORTED
```

---

# Error Handling

Azios returns standardized error objects.

```javascript
try {
  await azios.get("https://wrong-url.test");
} catch (error) {
  console.log(error.name);     // AziosError
  console.log(error.code);     // NETWORK_ERROR
}
```

Structured errors make debugging easier.

---

# Architecture Overview

Azios follows a modular request pipeline.

```
User Code
   ↓
Azios Instance
   ↓
Request Interceptors
   ↓
dispatchRequest (HTTP engine)
   ↓
Node.js http/https modules
   ↓
Response Interceptors
   ↓
Return Response
```

---

# Project Structure

```
src
 ├── core
 │    ├── Azios.ts
 │    ├── createInstance.ts
 │    └── dispatchRequest.ts
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

## v0.1

* Core HTTP client
* Instances
* JSON handling
* Basic request configuration

## v0.2

* Interceptor pipeline
* Structured error system
* Request cancellation
* Query parameter serializer

## Upcoming

Future improvements planned:

* Retry mechanism
* Request deduplication
* Built-in caching
* Rate limiting
* Plugin system
* Middleware ecosystem

---

# Contributing

Contributions are welcome.

If you'd like to improve Aziosxjs:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

# Author

Azeem Ali

---

# License

MIT
