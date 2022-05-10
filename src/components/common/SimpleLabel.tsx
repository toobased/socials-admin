interface SimpleLabelProps {
  label: string
}
const SimpleLabel = ({
  label = ""
}: SimpleLabelProps) => {
  return (
    <div className="font-semibold text-md mb-1">
      { label }
    </div>
  )
}

export default SimpleLabel
