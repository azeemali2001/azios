export default function buildURL(
  url: string,
  params?: Record<string, any>
) {

  if (!params) return url

  const parts: string[] = []

  Object.keys(params).forEach(key => {

    const val = params[key]

    if (val === null || typeof val === "undefined") {
      return
    }

    if (Array.isArray(val)) {

      val.forEach(v => {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
        )
      })

    } else {

      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
      )

    }

  })

  if (parts.length === 0) return url

  const serialized = parts.join("&")

  return url.includes("?")
    ? `${url}&${serialized}`
    : `${url}?${serialized}`

}