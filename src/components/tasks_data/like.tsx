import { BotTasksContext } from "@/store/botsTasksStore"
import { sweetyDate } from "@/utils"
import { observer } from "mobx-react"
import { useContext } from "react"
import TaskDataTile from "../common/TaskDataTile"

export const LikeTaskDataInfo = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const currentTask = tasksStore.currentTask
  // const data = currentTask.
  const data = currentTask?.action.LikeAction

  if (!data) {
    return (
      <>
      </>
    )
  }

  return (
    <div>
    {/* post_link */}
      <TaskDataTile 
        label="Post link"
        data={""}
      />
    {/* post_link */}
    {/* like_post */}
      <TaskDataTile 
        label="Like count"
        data={""}
      />
    {/* like_post */}
    {/* work_lag */}
      <TaskDataTile 
        label="Work lag"
        data={""}
      />
    {/* work_lag */}
    {/* date_finish */}
      <TaskDataTile 
        label="Work lag"
        data={""}
      />
    {/* date_finish */}
    </div>
  )
})

