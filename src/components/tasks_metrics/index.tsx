import { BotTasksContext } from "@/store/botsTasksStore"
import { observer } from "mobx-react"
import { useContext } from "react"

const TaskMetrics = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const currentTask = tasksStore.currentTask

  return (
    <>
    </>
  )
})

export default TaskMetrics
