import { message } from "antd"
import { AxiosResponse } from "axios"

/**
 * copy @param {string} text to clipboard
 *
**/
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  message.success(
    "Copied to clipboard!",
  )
}

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

export function simpleProcessResponse(
  resp: AxiosResponse,
  successMsg: string = "its okey",
  errorMsg: string = "smth fucked up"
): [boolean, string] {
  if (resp.status == 200) {
    return [true, successMsg]
  }
  const msg = resp.data?.detail || errorMsg
  return [false, msg]
}
