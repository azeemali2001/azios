# Changelog

All notable changes to this project will be documented in this file.

## [0.5.0] - 2026-03-13 🚀

### Added (Sprint 5 - Plugin System)
- **Plugin Architecture** - Extensible plugin system with full lifecycle support
  - `PluginManager` class for managing plugin installation/uninstallation
  - Plugin hooks: `onInstall`, `beforeRequest`, `afterResponse`, `onError`, `onUninstall`
  - Full production-grade error handling and plugin isolation
  - Example plugins for authentication, logging, retry, and transformation

### Added (Sprint 5 - Middleware System)
- **Middleware Pipeline** - Koa-style middleware pattern
  - `MiddlewareManager` for middleware registration
  - `compose` function for middleware chain execution
  - Support for async middleware with proper error propagation
  - Middleware context for shared state across pipeline

### Added (Sprint 6 - TypeScript Support)
- **Full TypeScript Type Definitions**
  - Strong typing for all exports
  - Type inference for responses
  - Complete API type coverage
  - Strict mode support

### Added (Sprint 7 - Universal Runtime)
- **Runtime Detection** - Automatic platform detection
  - Node.js support (primary)
  - Browser support (XHR adapter)
  - Future support: Bun, Deno, Edge Runtimes
  - `detectRuntime()` utility for platform-aware code
  - `AdapterFactory` for runtime-specific adapters
  - `UniversalHttpAdapter` for multi-platform support

### Fixed
- Fixed all TypeScript compilation errors
- Improved error handling across plugins and middleware
- Enhanced type safety throughout codebase
- Fixed window/document type detection in non-DOM environments

### Changed
- Updated package.json to v0.5.0
- Expanded keywords to reflect plugin and middleware support
- Added comprehensive test scripts
- Improved module exports organization

### Testing
- Added comprehensive test suite covering all sprints
- 100% test pass rate (13/13 tests)
- Test coverage: HTTP operations, interceptors, retry, deduplication, cache, rate limiting, plugins, middleware

---

## [0.4.1] - Previously Released

### Sprint 1 - Core HTTP
- GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS methods
- Request config (headers, params, data, timeout, responseType)
- Multiple instances support
- Auto JSON stringify/parse

### Sprint 2 - Pipeline / Request Control
- Request and response interceptors
- Structured error system (AziosError)
- Request cancellation (AbortSignal)
- Query parameter serialization

### Sprint 3 - Performance
- Retry system with exponential backoff
- Request deduplication (prevent concurrent duplicate requests)
- Memory-efficient pending request tracking

### Sprint 4 - Performance Enhancement
- Response caching with TTL support
- Rate limiting with concurrent request control
- Configurable backend delay

---

## Version History

- **0.5.0** - Plugin system, middleware, TypeScript, universal runtime
- **0.4.1** - Cache and rate limiting
- **0.3.0** - Retry and deduplication
- **0.2.0** - Interceptors and structured errors
- **0.1.0** - Core HTTP functionality
