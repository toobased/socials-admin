import { Button } from "@chakra-ui/react"
import { Icon } from "@iconify/react"

const ErrorIcon = () => {
  return (
    <Button className="" colorScheme="red" size="sm">
        <Icon icon="material-symbols:error-outline-rounded" fontSize="20px"/>
    </Button>
  )
}

export default ErrorIcon
