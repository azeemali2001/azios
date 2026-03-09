import azios from "../src"

async function test() {

  const res = await azios.get(
    "https://jsonplaceholder.typicode.com/users",
    {
      params: { _limit: 2 }
    }
  )

  console.log(res.data)

}

test()