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
    <MenuButton as={Button}>
        <div className="flex items-center">
            <div> {inner} </div>
            <Icon
                color={'white'}
              icon={
                isOpened ? 'fluent:chevron-up-12-filled' :
                  'fluent:chevron-down-12-filled'
              }
            />
        </div>
    </MenuButton>
  )
}

export default SelectMenuButton
