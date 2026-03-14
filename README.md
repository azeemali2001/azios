# Aziosxjs

[![npm version](https://badge.fury.io/js/aziosxjs.svg)](https://badge.fury.io/js/aziosxjs) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)

A lightweight, modular HTTP client with a clean API and a composable request pipeline.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Plugins & Middleware](#plugins--middleware)
- [Performance Features](#performance-features)
- [Error Handling](#error-handling)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install aziosxjs
```

---

## Quick Start

```js
import azios from "aziosxjs";

const response = await azios.get("https://jsonplaceholder.typicode.com/users/1");
console.log(response.data);
```

---

## Core Concepts

### HTTP Methods

```js
await azios.get("/users");
await azios.post("/users", { name: "Jane" });
await azios.put("/users/1", { name: "Jane" });
await azios.delete("/users/1");
```

### Configuration

```js
const response = await azios.request({
  url: "/users",
  method: "GET",
  baseURL: "https://api.example.com",
  params: { page: 1, limit: 10 },
  headers: { Authorization: "Bearer TOKEN" },
  timeout: 5000,
});
```

### Instances

```js
import { createInstance } from "aziosxjs";

const api = createInstance({ baseURL: "https://api.example.com" });
await api.get("/users");
```

---

## Plugins & Middleware

### Plugin System

Plugins provide a clean way to extend Aziosxjs behavior.

```js
import type { AziosPlugin } from "aziosxjs";

const authPlugin: AziosPlugin = {
  name: "auth",
  version: "1.0.0",
  hooks: {
    beforeRequest: (config) => ({
      ...config,
      headers: { ...config.headers, Authorization: "Bearer TOKEN" },
    }),
  },
};

await azios.installPlugin(authPlugin);
```

### Middleware

Middleware runs in sequence and can modify the request/response pipeline.

```js
import type { AziosMiddleware } from "aziosxjs";

const logger: AziosMiddleware = async (config, next) => {
  console.log("→", config.method, config.url);
  const res = await next();
  console.log("←", res.status);
  return res;
};

azios.use(logger);
```

---

## Performance Features

### Retry + Backoff

```js
await azios.get("/unstable", { retry: 3, retryDelay: 500 });
```

### Deduplication

Identical concurrent requests share the same network call.

### Caching

```js
await azios.get("/users", { cache: true, cacheTTL: 5000 });
```

### Rate Limiting

```js
await azios.get("/users", { rateLimit: 5 });
```

---

## Error Handling

Aziosxjs throws `AziosError` instances with structured metadata.

```js
try {
  await azios.get("/404");
} catch (err) {
  console.log(err.code, err.message);
}
```

---

## Running Tests

```bash
npm test
```

---

## Contributing

Contributions are welcome. Please open an issue or pull request.

---

## License

MIT © 2026 Azeem Ali

