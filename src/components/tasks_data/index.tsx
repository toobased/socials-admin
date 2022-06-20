import { IBotTask, IBotTaskError } from "@/models/bots_tasks"
import { TaskTypeEnum } from "@/models/enums/bot_tasks"
import { BotTasksContext } from "@/store/botsTasksStore"
import { Heading } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"
import { LikePostDataInfo } from "./like_post"
import { RegularLikeGroupInfoBlock } from "./regular_like_group"

export interface TaskErrorProps {
  error: IBotTaskError 
}

export const TaskError = ({ error }: TaskErrorProps) => {
  return (
    <div className="bg-red-500 p-4 my-2 text-white rounded-md max-w-xl">
      <Heading size="sm" color="white">
        Task error
      </Heading>
      <div className="mt-3">
        { error.error_msg }
      </div>
      <div>
        { error.detail_msg }
      </div>
    </div>
  )
}

export const TaskDataInfo = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const currentTask = tasksStore.currentTask

  if (!currentTask) {
    return ( <></>) }

  const taskType = currentTask.task_type

  return (
    <div
      className="bg-white rounded-lg py-3 px-4 m-3"
    >
      <Heading size="lg">
        Task Data
      </Heading>
      { currentTask.error &&
        <TaskError error={currentTask.error} />
      }
      {taskType == TaskTypeEnum.like_post &&
        <LikePostDataInfo />
      }
      {taskType == TaskTypeEnum.regular_like_group &&
        <RegularLikeGroupInfoBlock />
      }
    </div>
  )
})
