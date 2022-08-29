export class LikeAction {
  test: string = ''
  constructor(p: Partial<LikeAction> = {}) {
    Object.assign(this, p)
  }
}
