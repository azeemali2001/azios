import { AziosRequestConfig } from "./config"
import { AziosResponse } from "./response"
import InterceptorManager from "../interceptors/InterceptorManager"

export interface AziosInstance {

  (config: AziosRequestConfig): Promise<AziosResponse>

  request(config: AziosRequestConfig): Promise<AziosResponse>

  get(url: string, config?: AziosRequestConfig): Promise<AziosResponse>

  post(url: string, data?: any, config?: AziosRequestConfig): Promise<AziosResponse>

  put(url: string, data?: any, config?: AziosRequestConfig): Promise<AziosResponse>

  patch(url: string, data?: any, config?: AziosRequestConfig): Promise<AziosResponse>

  delete(url: string, config?: AziosRequestConfig): Promise<AziosResponse>

  head(url: string, config?: AziosRequestConfig): Promise<AziosResponse>

  options(url: string, config?: AziosRequestConfig): Promise<AziosResponse>

  interceptors: {
    request: InterceptorManager<AziosRequestConfig>
    response: InterceptorManager<AziosResponse>
  }

}