export interface AziosRequestConfig {
  url?: string
  method?: string
  baseURL?: string
  headers?: Record<string, any>
  params?: Record<string, any>
  data?: any
  timeout?: number
  responseType?: string
  signal?: AbortSignal
}