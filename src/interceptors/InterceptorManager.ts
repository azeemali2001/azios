type FulfilledFn<T> = (val: T) => T | Promise<T>
type RejectedFn = (error: any) => any

interface Interceptor<T> {
  fulfilled: FulfilledFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {

  private handlers: Array<Interceptor<T> | null> = []

  use(fulfilled: FulfilledFn<T>, rejected?: RejectedFn) {
    this.handlers.push({
      fulfilled,
      rejected
    })

    return this.handlers.length - 1
  }

  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.handlers.forEach(h => {
      if (h !== null) {
        fn(h)
      }
    })
  }

}