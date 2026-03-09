import { AziosRequestConfig } from "./config"
import { AziosResponse } from "./response"

export interface AziosInstance {

  (config: AziosRequestConfig): Promise<AziosResponse>

  request(config: AziosRequestConfig): Promise<AziosResponse>

  get(url: string, config?: AziosRequestConfig): Promise<AziosResponse>

  post(url: string, data?: any, config?: AziosRequestConfig): Promise<AziosResponse>

}