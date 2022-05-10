interface ITaskDataTileProps {
  label: string;
  data: string;
}

const TaskDataTile = ({
  label = '',
  data = ''
}: ITaskDataTileProps) => {
  return (
    <div
      className=""
    >
      <div
        className="font-semibold"
      >
        { label }
      </div>
      <div>
        { data }
      </div>
    </div>
  )
}

export default TaskDataTile
