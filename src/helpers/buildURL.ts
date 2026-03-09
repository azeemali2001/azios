export default function buildURL(url: string, params?: Record<string, any>) {

  if (!params) return url

  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&")

  if (!query) return url

  return url.includes("?") ? `${url}&${query}` : `${url}?${query}`
}