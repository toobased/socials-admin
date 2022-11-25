export class DbFindResult<T> {
    items: Array<T> = [];
    total: number = 0;

    constructor(p: Partial<DbFindResult<T>> = {}) { Object.assign(this, p) }
}
