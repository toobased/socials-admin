import { Button, MenuButton } from "@chakra-ui/react"
import { Icon } from "@iconify/react"

interface SelectMenuButtonProps {
  inner: React.ReactNode,
  isOpened?: boolean
}

const SelectMenuButton = ({
  inner = "",
  isOpened = false
}: SelectMenuButtonProps) => {
  return (
    <MenuButton>
      <Button
        variant="outline"
        className="flex gap-2 items-center"
      >
        <div>
          {inner}
        </div>
        <Icon
            color={'white'}
          icon={
            isOpened ? 'fluent:chevron-up-12-filled' :
              'fluent:chevron-down-12-filled'
          }
        />
      </Button>
    </MenuButton>
  )
}

export default SelectMenuButton
