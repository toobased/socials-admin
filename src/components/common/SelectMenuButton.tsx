import { Button, MenuButton } from "@chakra-ui/react"
import { Icon } from "@iconify/react"

interface SelectMenuButtonProps {
  inner: React.ReactNode
}

const SelectMenuButton = ({
  inner = ""
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
      </Button>
    </MenuButton>
  )
}

export default SelectMenuButton
