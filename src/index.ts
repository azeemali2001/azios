import { createInstance } from "./core/createInstance"

// Export main instance
const azios = createInstance({
  url: ""
})

// ============================================
// Type Exports
// ============================================

export type { AziosRequestConfig } from "./types/config"
export type { AziosResponse } from "./types/response"
export type { AziosInstance } from "./types/request"
export type { AziosPlugin, PluginHooks } from "./types/plugin"

// ============================================
// Class Exports
// ============================================

export { default as AziosError } from "./errors/AziosError"
export { default as InterceptorManager } from "./interceptors/InterceptorManager"
export { default as Azios } from "./core/Azios"
export { createInstance } from "./core/createInstance"

// ============================================
// Plugin System Exports
// ============================================

export { default as PluginManager } from "./plugins/pluginManager"

// ============================================
// Middleware System Exports
// ============================================

export { default as MiddlewarePipeline } from "./middleware/MiddlewarePipeline"
export type { RequestMiddleware, ResponseMiddleware } from "./middleware/MiddlewarePipeline"

// ============================================
// Runtime Support Exports
// ============================================

export {
  detectRuntime,
  currentRuntime,
  isRuntime,
  isServerRuntime,
  isBrowserRuntime,
  RuntimeType
} from "./runtimes/detectRuntime"
export { default as AdapterFactory } from "./runtimes/AdapterFactory"

// ============================================
// Cache & Rate Limit Exports
// ============================================

export { getCache, setCache, clearCache } from "./cache/memoryCache"
export { schedule } from "./rateLimiter/rateLimiter"

// ============================================
// Default Export
// ============================================

export default azios