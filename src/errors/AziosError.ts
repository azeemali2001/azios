export default class AziosError extends Error {

  config: any
  code?: string
  request?: any
  response?: any

  constructor(
    message: string,
    code?: string,
    config?: any,
    request?: any,
    response?: any
  ) {

    super(message)

    this.name = "AziosError"
    this.code = code
    this.config = config
    this.request = request
    this.response = response

  }

}