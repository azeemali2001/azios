export default class MiddlewareManager {

  middlewares: any[] = []

  use(fn: any) {
    this.middlewares.push(fn)
  }

}