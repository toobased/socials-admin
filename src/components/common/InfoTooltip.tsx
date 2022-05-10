import { Button, Tooltip } from "@chakra-ui/react"
import { Icon } from "@iconify/react"

interface InfoTooltipProps {
  text?: string
  size?: string
}

const InfoTooltip = ({
  text = 'tooltip',
  size = 'xs'
}: InfoTooltipProps) => {
  return (
    <Tooltip
      label={text}
      placement="top"
    >
      <Button
        colorScheme="gray"
        size={size}
      >
        <Icon
          icon="fa6-solid:info"
        />
      </Button>
    </Tooltip>
  )
}

export default InfoTooltip
