const pendingRequests = new Map()

export function getPending(key: string) {
  return pendingRequests.get(key)
}

export function setPending(key: string, promise: Promise<any>) {
  pendingRequests.set(key, promise)
}

export function removePending(key: string) {
  pendingRequests.delete(key)
}