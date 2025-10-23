export class BucketmateNextError extends Error {
  public readonly status: number
  public readonly details?: unknown

  constructor(message: string, status = 500, details?: unknown) {
    super(message)
    this.name = 'BucketmateNextError'
    this.status = status
    this.details = details
  }
}
