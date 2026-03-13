import type { HttpAdapter } from './HttpAdapter'
import { currentRuntime, RuntimeType } from './detectRuntime'
import UniversalHttpAdapter from './UniversalHttpAdapter'

/**
 * Adapter factory for selecting the appropriate HTTP adapter
 * Uses universal Fetch API when available with fallbacks for specific runtimes
 */
export class AdapterFactory {
  private static adapters: Map<RuntimeType, HttpAdapter> = new Map()

  /**
   * Get or create adapter for current runtime
   */
  static getAdapter(): HttpAdapter {
    if (!this.adapters.has(currentRuntime)) {
      this.adapters.set(currentRuntime, new UniversalHttpAdapter())
    }

    const adapter = this.adapters.get(currentRuntime)!

    if (!adapter.isSupported()) {
      throw new Error(
        `No supported HTTP adapter found for runtime: ${currentRuntime}`
      )
    }

    return adapter
  }

  /**
   * Register custom adapter for specific runtime
   */
  static registerAdapter(runtime: RuntimeType, adapter: HttpAdapter): void {
    this.adapters.set(runtime, adapter)
  }

  /**
   * Clear adapter cache
   */
  static clearCache(): void {
    this.adapters.clear()
  }
}

export default AdapterFactory
