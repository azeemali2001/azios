/**
 * Runtime detection utilities
 * Identifies the current JavaScript runtime environment
 * Supports: Node.js, Browser, Bun, Deno, Cloudflare Workers/Edge
 */

export enum RuntimeType {
  Node = 'node',
  Browser = 'browser',
  Bun = 'bun',
  Deno = 'deno',
  Edge = 'edge',
  Unknown = 'unknown'
}

/**
 * Detects the current runtime environment
 * Production-grade detection with reliable environment checks
 */
export function detectRuntime(): RuntimeType {
  // Check for Deno
  if (typeof (globalThis as any).Deno !== 'undefined') {
    return RuntimeType.Deno
  }

  // Check for Bun
  if (typeof (globalThis as any).Bun !== 'undefined') {
    return RuntimeType.Bun
  }

  // Check for Cloudflare Workers / Edge
  if (
    typeof (globalThis as any).caches !== 'undefined' &&
    typeof (globalThis as any).ENVIRONMENT !== 'undefined'
  ) {
    return RuntimeType.Edge
  }

  // Check for Node.js
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    return RuntimeType.Node
  }

  // Check for Browser
  if (typeof (globalThis as any).window !== 'undefined' && typeof (globalThis as any).document !== 'undefined') {
    return RuntimeType.Browser
  }

  return RuntimeType.Unknown
}

/**
 * Get current runtime for use in adapters
 */
export const currentRuntime = detectRuntime()

/**
 * Check if running in a specific runtime
 */
export function isRuntime(runtime: RuntimeType): boolean {
  return currentRuntime === runtime
}

/**
 * Check if running in server-side runtime
 */
export function isServerRuntime(): boolean {
  return (
    currentRuntime === RuntimeType.Node ||
    currentRuntime === RuntimeType.Bun ||
    currentRuntime === RuntimeType.Deno ||
    currentRuntime === RuntimeType.Edge
  )
}

/**
 * Check if running in browser runtime
 */
export function isBrowserRuntime(): boolean {
  return currentRuntime === RuntimeType.Browser
}
