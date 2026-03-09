import Azios from "./Azios"
import { AziosRequestConfig } from "../types/config"
import { AziosInstance } from "../types/request"

export function createInstance(config: AziosRequestConfig): AziosInstance {

  const context = new Azios(config)

  const instance = Azios.prototype.request.bind(context) as AziosInstance

  Object.getOwnPropertyNames(Azios.prototype).forEach(method => {

    if (method !== "constructor") {
      ;(instance as any)[method] = (Azios.prototype as any)[method].bind(context)
    }

  })

  // attach interceptors
  instance.interceptors = context.interceptors

  return instance
}