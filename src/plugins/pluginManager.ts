import type { AziosPlugin, PluginRegistry } from '../types/plugin'
import type { AziosInstance } from '../types/request'
import type { AziosRequestConfig } from '../types/config'
import type { AziosResponse } from '../types/response'

/**
 * PluginManager handles plugin lifecycle and hook execution
 * Production-grade plugin system with error handling and validation
 */
export default class PluginManager {
  private plugins: PluginRegistry = {}

  /**
   * Install a plugin and trigger its onInstall hook
   * @throws Error if plugin name is already registered
   */
  async install(plugin: AziosPlugin, instance: AziosInstance): Promise<void> {
    if (this.plugins[plugin.name]) {
      throw new Error(`Plugin "${plugin.name}" is already installed`)
    }

    this.plugins[plugin.name] = plugin

    try {
      if (plugin.hooks.onInstall) {
        await plugin.hooks.onInstall(instance)
      }
    } catch (err) {
      // Rollback on error
      delete this.plugins[plugin.name]
      throw err
    }
  }

  /**
   * Uninstall a plugin and trigger its onUninstall hook
   */
  async uninstall(pluginName: string, instance: AziosInstance): Promise<void> {
    const plugin = this.plugins[pluginName]

    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" is not installed`)
    }

    try {
      if (plugin.hooks.onUninstall) {
        await plugin.hooks.onUninstall(instance)
      }
    } finally {
      delete this.plugins[pluginName]
    }
  }

  /**
   * Execute beforeRequest hooks from all plugins
   */
  async executeBeforeRequestHooks(
    config: AziosRequestConfig
  ): Promise<AziosRequestConfig> {
    let result = config

    for (const plugin of Object.values(this.plugins)) {
      if (plugin.hooks.beforeRequest) {
        try {
          result = await plugin.hooks.beforeRequest(result)
        } catch (err) {
          throw new Error(
            `Plugin "${plugin.name}" beforeRequest hook failed: ${err instanceof Error ? err.message : String(err)}`
          )
        }
      }
    }

    return result
  }

  /**
   * Execute afterResponse hooks from all plugins
   */
  async executeAfterResponseHooks(
    response: AziosResponse
  ): Promise<AziosResponse> {
    let result = response

    for (const plugin of Object.values(this.plugins)) {
      if (plugin.hooks.afterResponse) {
        try {
          result = await plugin.hooks.afterResponse(result)
        } catch (err) {
          throw new Error(
            `Plugin "${plugin.name}" afterResponse hook failed: ${err instanceof Error ? err.message : String(err)}`
          )
        }
      }
    }

    return result
  }

  /**
   * Execute onError hooks from all plugins
   */
  async executeOnErrorHooks(error: Error): Promise<Error> {
    let result = error

    for (const plugin of Object.values(this.plugins)) {
      if (plugin.hooks.onError) {
        try {
          result = await plugin.hooks.onError(result)
        } catch (err) {
          // Log but don't throw - error handlers should not crash
          console.warn(
            `Plugin "${plugin.name}" onError hook failed:`,
            err instanceof Error ? err.message : String(err)
          )
        }
      }
    }

    return result
  }

  /**
   * Get all currently installed plugins
   */
  getInstalledPlugins(): AziosPlugin[] {
    return Object.values(this.plugins)
  }

  /**
   * Check if a plugin is installed
   */
  isPluginInstalled(name: string): boolean {
    return name in this.plugins
  }

  /**
   * Clear all plugins
   */
  clear(): void {
    this.plugins = {}
  }
}