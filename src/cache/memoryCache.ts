type CacheEntry = {
  data: any
  expiry: number
}

const cache = new Map<string, CacheEntry>()

export function getCache(key: string) {

  const entry = cache.get(key)

  if (!entry) return null

  // remove expired cache
  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }

  return entry.data

}

export function setCache(
  key: string,
  value: any,
  ttl: number = 5000
) {

  const expiry = Date.now() + ttl

  cache.set(key, {
    data: value,
    expiry
  })

}

export function clearCache(key: string) {
  cache.delete(key)
}

export function clearAllCache() {
  cache.clear()
}