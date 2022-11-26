import { createStandaloneToast, UseToastOptions } from "@chakra-ui/react"
import { message } from "antd"
import { AxiosResponse } from "axios"
import { BaseError, Result } from "./api/models/base"
import { IFilterValue } from "./models/bots"

export function shortStr (v: any, c = 6) {
    if (typeof v != 'string') { return '' }
    if (v.length <= c * 2) { return v }
    const f = v.substring(0, c)
    const s = v.substring(v.length - c, v.length)
    return `${f}...${s}`
}

const chakraToast = createStandaloneToast()

/**
 * copy @param {string} text to clipboard
 *
**/
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  successMessageChakra(
    "Copied to clipboard!",
  )
  /*
  message.success(
    "Copied to clipboard!",
  )
  */
}

// antd messages
export function successMessage(text: string) {
  message.success(
    `${text}`
  )
}

export function errorMessage(text: string) {
  message.error(
    `${text}`
  )
}

// chakra messages
export function successMessageChakra(desc: string) {
  chakraToast({
    title: 'Success',
    description: desc,
    status: 'success',
    duration: 2000,
    isClosable: true,
    position: "top"
  } as UseToastOptions)
}
// chakra messages
export function errorMessageChakra(desc: string) {
  chakraToast({
    title: 'Error',
    description: desc,
    status: 'error',
    duration: 3000,
    isClosable: true,
    position: "top"
  } as UseToastOptions)
}

export function simpleProcessResponse(
  resp: AxiosResponse,
  successMsg: string = "its okey",
  errorMsg: string = "smth fucked up"
): [boolean, string] {
  if (resp.status == 200) {
    return [true, successMsg]
  }
  const msg = resp.data?.detail || errorMsg
  return [false, JSON.stringify(msg)]
}


export function stringToDate(
    s: string
) {
    return new Date(s)
}

export function sweetyDate(
    s: string
) {
    return stringToDate(s).toUTCString()
}

export function getFilterByLabel(
    label: string | number | undefined,
    filters: IFilterValue[]
): IFilterValue | undefined {
    const defV = filters[0]
    if (label === undefined) { return defV }
    return filters.filter(s => s.label == label)[0] || defV
}

export function fireErr<T, _E = BaseError>(p: AxiosResponse<Result<T>>) {
    const st = p.status
    const msg = `${st} || ${p.data.Err.msg}`
    errorMessageChakra(msg)
}
