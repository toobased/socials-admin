import { BotTasksContext } from "@/store/botsTasksStore"
import { observer } from "mobx-react"
import { useContext } from "react"
import TaskDataTile from "../common/TaskDataTile"

export const WatchTaskDataInfo = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const currentTask = tasksStore.currentTask
  const action = currentTask?.action.WatchAction

  if (!action) { return (<></>) }

  const data = action.data
  const stats = action.stats

  return (
    <div>
      <TaskDataTile 
        label="Resource link"
        data={data.resource_link}
      />
      <TaskDataTile 
        label="Watch count"
        data={`${data.watch_count}`}
      />
      <TaskDataTile 
        label="Watched count"
        data={`${stats.watched_count}`}
      />
      <TaskDataTile 
        label="Time spread (seconds)"
        data={`${data.time_spread}`}
      />
    </div>
  )
})

