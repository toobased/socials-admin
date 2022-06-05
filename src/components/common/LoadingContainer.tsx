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
      <div className="flex flex-col items-center border-8 h-screen gap-4 justify-center">
        <div className="">
          <img src="/pnd.svg" className="h-auto max-h-64" alt="pnd" />
        </div>
        <Icon icon="line-md:loading-loop" width={loaderWidth} />
      </div>
    </div>
  )
}

export default LoadingContainer
