export class DbFindResult<T> {
  items!: Array<T>;
  total!: number;

  constructor(p: Partial<DbFindResult<T>>) {
    Object.assign(this, p)
  }
}
