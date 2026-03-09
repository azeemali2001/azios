# Aziosxjs

A lightweight HTTP client for Node.js inspired by Axios.

Aziosxjs provides a simple and clean API for making HTTP requests while keeping the internal architecture modular and extensible.

This project was built to explore how HTTP client libraries like Axios work internally, including request pipelines, interceptors, and adapter-based networking.

---

## Features

* Simple and clean API
* Promise-based HTTP requests
* Built using low-level Node.js `http` and `https` modules
* Interceptor system for request/response manipulation
* TypeScript support
* Modular architecture for future extensions

---

## Installation

Install the package using npm:

```
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

## Basic Usage

### GET Request

```javascript
const res = await azios.get("https://api.example.com/users");

console.log(res.data);
```

---

### POST Request

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

## Interceptors

Interceptors allow you to modify requests or responses globally.

### Request Interceptor

```javascript
azios.interceptors.request.use(config => {
  console.log("Request intercepted");
  return config;
});
```

---

### Response Interceptor

```javascript
azios.interceptors.response.use(response => {
  console.log("Response intercepted");
  return response;
});
```

---

## Architecture Overview

Aziosxjs follows a modular architecture:

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

## Project Structure

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
 ├── types
 │    ├── config.ts
 │    ├── request.ts
 │    └── response.ts
 │
 └── index.ts
```

---

## Roadmap

Future improvements planned:

* Interceptor execution pipeline
* Automatic JSON parsing
* Retry strategy
* Request deduplication
* Caching layer
* Plugin system

---

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

---

## Author

Azeem Ali

---

## License

MIT
