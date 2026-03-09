export class AziosError extends Error {
  config: any
  code?: string
  request?: any
  response?: any

  constructor(message: string, config: any) {
    super(message)
    this.config = config
  }
}