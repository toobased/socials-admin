import { Icon } from "@iconify/react"

interface BooleanComponentProps { 
  value?: boolean,
  applyText?: boolean,
  reverseEffect?: boolean,
  posColor?: string,
  negColor?: string
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

const BooleanComponent = ({
  value = false,
  applyText = true,
  reverseEffect = false,
  posColor = "#4ADE80",
  negColor = "#F87171"
}: BooleanComponentProps) => {
  const currentText =
    value && "Yes" || "No"
  const currentBackgroundColor = () => {
    if (
      (value && !reverseEffect) ||
      (!value && reverseEffect)
    ) {
      return posColor
    }
    return negColor
  }
  if (applyText) {
    return (
      <div style={{
        background: currentBackgroundColor(),
      }}
      className="max-w-max rounded-md py-1 px-2 text-white"
      >
        { currentText }
      </div>
    )
  }
  if (value) {
    return <TrueIcon />
  } else {
    return <FalseIcon />
  }
}

export default BooleanComponent 
