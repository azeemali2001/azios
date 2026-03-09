import http from "http"
import https from "https"
import { URL } from "url"

import { AziosRequestConfig } from "../types/config"
import { AziosResponse } from "../types/response"

export default function dispatchRequest(config: AziosRequestConfig) {

  return new Promise<AziosResponse>((resolve, reject) => {

    const fullURL = config.baseURL
      ? config.baseURL + config.url
      : config.url

    const parsedURL = new URL(fullURL!)

    const isHttps = parsedURL.protocol === "https:"

    const options = {
      hostname: parsedURL.hostname,
      port: parsedURL.port || (isHttps ? 443 : 80),
      path: parsedURL.pathname + parsedURL.search,
      method: config.method || "GET",
      headers: config.headers || {}
    }

    const transport = isHttps ? https : http

    const req = transport.request(options, res => {

      let data = ""

      res.on("data", chunk => {
        data += chunk
      })

      res.on("end", () => {

        const response: AziosResponse = {
          data: data,
          status: res.statusCode || 0,
          statusText: res.statusMessage || "",
          headers: res.headers,
          config,
          request: req
        }

        resolve(response)

      })

    })

    req.on("error", err => {
      reject(err)
    })

    if (config.data) {
      req.write(JSON.stringify(config.data))
    }

    req.end()

  })

}