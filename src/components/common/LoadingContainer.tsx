import { Icon } from "@iconify/react"
import { CSSProperties } from "react"

interface LoadingContainerProps {
  style?: CSSProperties;
  loaderWidth?: string;
}
const LoadingContainer = ({
  style = {},
  loaderWidth = '100px'
}: LoadingContainerProps) => {
  return (
    <div style={style}>
      <div className="flex flex-col items-center gap-4 justify-center">
        <Icon icon="line-md:loading-loop" width={loaderWidth} />
      </div>
    </div>
  )
}

export default LoadingContainer
