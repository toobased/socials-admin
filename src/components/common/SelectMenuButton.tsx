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
        variant="ghost"
        className="flex gap-2 items-center"
        bgColor="white"
        textColor="black"
      >
        <div>
          {inner}
        </div>
        <Icon
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
