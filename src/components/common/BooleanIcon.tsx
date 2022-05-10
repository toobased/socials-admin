import { Icon } from "@iconify/react"

type BooleanIconProps = { 
  value?: boolean 
}


const TrueIcon = () => {
  return (
    <div className="bg-green-400 max-w-max rounded-full p-1.5">
      <Icon
        icon="bi:check-lg"
        width={15}
        className="text-white"
      />
    </div>
  )
}
const FalseIcon = () => {
  return (
    <div className="bg-red-500 max-w-max rounded-full p-1.5">
      <Icon
        icon="akar-icons:cross"
        width={15}
        className="text-white"
      />
    </div>
  )
}

const BooleanIcon = ({
  value = false
}: BooleanIconProps) => {
  if (value) {
    return <TrueIcon />
  } else {
    return <FalseIcon />
  }
}

export default BooleanIcon
