import azios from "../src"

azios.interceptors.request.use(config => {
  console.log("REQUEST INTERCEPTOR")
  return config
})

azios.interceptors.response.use(res => {
  console.log("RESPONSE INTERCEPTOR")
  return res
})

async function test() {

  console.log("TEST 1 - QUERY PARAMS")

  const res = await azios.get(
    "https://jsonplaceholder.typicode.com/posts",
    {
      params: { _limit: 2 }
    }
  )

  console.log(res.data)

  console.log("TEST 2 - POST")

  const post = await azios.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      title: "Azios",
      body: "Sprint2",
      userId: 1
    }
  )

  console.log(post.data)

  console.log("TEST 3 - CANCELLATION")

  const controller = new AbortController()

  const request = azios.get(
    "https://jsonplaceholder.typicode.com/users",
    { signal: controller.signal }
  )

  controller.abort()

  try {
    await request
  } catch (err: any) {
    console.log("Cancelled:", err.code)
  }

}

test()