export function compose(middleware: any[]) {

  return function (context: any) {

    let index = -1

    function dispatch(i: number): Promise<any> {

      if (i <= index) {
        return Promise.reject(new Error("next() called multiple times"))
      }

      index = i

      const fn = middleware[i]

      if (!fn) return Promise.resolve()

      try {
        return Promise.resolve(
          fn(context, () => dispatch(i + 1))
        )
      } catch (err) {
        return Promise.reject(err)
      }

    }

    return dispatch(0)

  }

}