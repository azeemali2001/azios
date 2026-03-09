import azios from "../src"

async function test() {

  const res = await azios.get("https://jsonplaceholder.typicode.com/users")

  console.log(res.data)

}

test()