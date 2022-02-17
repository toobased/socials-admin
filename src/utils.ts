import { message } from "antd"

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
