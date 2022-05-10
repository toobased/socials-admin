import { copyToClipboard } from '@/utils'
import { Icon } from '@iconify/react'
import { Button, Tooltip } from 'antd'
import React from 'react'

const CopyClipboardButton: React.FC<{
  copyContent?: string
}> = ({
  copyContent = "some content to copy"
}) => {
  return (
    <Tooltip
      placement="top"
      title="click to copy"
    >
      <Button
        type="text"
        size="small"
        onClick={() => copyToClipboard(copyContent)}
      >
        <Icon icon="ci:copy"
          width={22}
        />
      </Button>
    </Tooltip>
  )
}

export default CopyClipboardButton
