import { AxiosResponse } from "axios"

export class BaseError {
    kind: string = ''
    msg: string = ''
    detail_msg: string = ''
}

export interface Result<T, E = BaseError> {
    Ok: T,
    Err: E
}

export function isErr<T, E = BaseError>(p: AxiosResponse<Result<T,E>>) {
    if (p.status != 200) { return true }
    if (p.data.Err) { return true }
    return false
}
