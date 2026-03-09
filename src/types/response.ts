import { AziosRequestConfig } from "./config"

export interface AziosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AziosRequestConfig
  request?: any
}