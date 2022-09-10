import { Icon } from '@iconify/react'
import { Tooltip } from 'antd'
import React from 'react'

const ExtLinkButton: React.FC<{
  link?: string
}> = ({
  link = ""
}) => {
  return (
    <Tooltip
      placement="top"
      title="click to open link"
    >
      <a
        rel="noreferrer"
        target="_blank"
        href={link}
      >
        <Icon icon="eva:external-link-fill"
          width={22}
        />
      </a>
    </Tooltip>
  )
}

export default ExtLinkButton
