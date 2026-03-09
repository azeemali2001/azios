const cache = new Map<string, { data: any, expiry: number }>()

export function getCache(key: string) {

  const entry = cache.get(key)

  if (!entry) return null

  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }

  return entry.data

}

export function setCache(key: string, value: any, ttl = 5000) {

  cache.set(key, {
    data: value,
    expiry: Date.now() + ttl
  })

}

export function clearCache(key: string) {
  cache.delete(key);
}