import { AziosRequestConfig } from './config'
import { AziosResponse } from './response'
import type { AziosInstance } from './request'

/**
 * Plugin lifecycle hooks
 * Allows plugins to inject behavior at various stages of the request/response pipeline
 */
export interface PluginHooks {
  /**
   * Called when plugin is installed
   */
  onInstall?(instance: AziosInstance): void | Promise<void>

  /**
   * Called before request is sent
   */
  beforeRequest?(config: AziosRequestConfig): AziosRequestConfig | Promise<AziosRequestConfig>

  /**
   * Called after response is received
   */
  afterResponse?(response: AziosResponse): AziosResponse | Promise<AziosResponse>

  /**
   * Called when an error occurs
   */
  onError?(error: Error): Error | Promise<Error>

  /**
   * Called when plugin is uninstalled
   */
  onUninstall?(instance: AziosInstance): void | Promise<void>
}

/**
 * Plugin definition with metadata
 */
export interface AziosPlugin {
  name: string
  version?: string
  hooks: PluginHooks
}

/**
 * Plugin registry to track installed plugins
 */
export interface PluginRegistry {
  [key: string]: AziosPlugin
}
