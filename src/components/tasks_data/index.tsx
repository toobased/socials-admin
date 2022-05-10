import { TaskTypeEnum } from "@/models/enums/bot_tasks"
import { BotTasksContext } from "@/store/botsTasksStore"
import { Heading } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"
import { LikePostDataInfo } from "./like_post"

export const TaskDataInfo = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const currentTask = tasksStore.currentTask

  if (!currentTask) {
    return (
      <>
      </>
    )
  }

  const taskType = currentTask.task_type

  return (
    <div
      className="bg-white rounded-lg py-3 px-4 m-3"
    >
      <Heading size="lg">
        Task Data
      </Heading>
      {taskType == TaskTypeEnum.like_post &&
        <LikePostDataInfo />
      }
    </div>
  )
})
