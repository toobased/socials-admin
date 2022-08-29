export class BaseDate {
  secs_since_epoch!: number
  nanos_since_epoch!: number

  constructor(p: Partial<BaseDate>) {
    Object.assign(this, p)
  }

  get toDate (): Date {
    return new Date(this.secs_since_epoch * 1000)
  }

  get sweety (): string {
    return this.toDate.toUTCString()
  }
}
