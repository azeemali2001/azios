import azios from "../src"

azios.interceptors.request.use(config => {
  console.log("Request interceptor triggered")
  return config
})

azios.interceptors.response.use(res => {
  console.log("Response interceptor triggered")
  return res
})

async function test() {

  const res = await azios.get(
    "https://jsonplaceholder.typicode.com/users"
  )

  console.log(res.data)

}

test()