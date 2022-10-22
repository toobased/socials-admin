import CopyClipboardButton from "../buttons/CopyClipboardButton"

type ErrorBoxProps = {
    kind?: string;
    msg?: string;
    detail?: string;
}

const SimpleTile = ({
    kind = "", msg = "", detail = ""
}: ErrorBoxProps) => {
  return (
    <div className="flex flex-col items-center bg-white max-w-max px-4 py-2 rounded-lg">
      <span className="">
        { kind }: &nbsp;
      </span>
      <span className="">
        { msg }: &nbsp;
      </span>
      <span className="font-semibold">
        { detail }
      </span>
    </div>
  )
}

export default SimpleTile
