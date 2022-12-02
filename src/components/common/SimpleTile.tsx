import CopyClipboardButton from "../buttons/CopyClipboardButton"

type SimpleTileProps = {
  title?: string;
  value?: string;
  useClipboard?: boolean;
}

const SimpleTile = ({
  title = undefined,
  value = "",
  useClipboard = true
}: SimpleTileProps) => {
  return (
    <div className="flex items-center max-w-max px-4 py-2 rounded-lg">
        { title &&
          <span className="">
            { title }: &nbsp;
          </span>
        }
      <span className="font-semibold">
        { value }
      </span>
      { useClipboard &&
        <CopyClipboardButton
          copyContent={value}
        />
      }
    </div>
  )
}

export default SimpleTile
