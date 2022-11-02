import { TaskError } from "@/models/bots_tasks"
import { TaskActionType } from "@/models/enums/bot_tasks"
import { BotTasksContext } from "@/store/botsTasksStore"
import { Heading } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"
import { WatchTaskDataInfo } from "./watch"

interface TaskErrorContainerProps {
  error: TaskError
}

export const TaskErrorContainer = (props: TaskErrorContainerProps) => {
  const error = props.error
  return (
    <div className="bg-red-500 p-4 my-2 text-white rounded-md max-w-xl">
      <Heading size="sm" color="white">
        Task error
      </Heading>
      <div className="mt-3">
        kind: { error.kind }, msg: { error.msg }
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

  const actionType = currentTask.action_type

  return (
    <div
      className="rounded-lg py-3 px-4 m-3"
    >
      <Heading size="lg">
        Task Data
      </Heading>
      { currentTask.error &&
        <TaskErrorContainer error={currentTask.error} />
      }
      {actionType == TaskActionType.Watch &&
        <WatchTaskDataInfo />
      }

      {/*
      {actionType == TaskActionType.like_post &&
        <LikePostDataInfo />
      }
      */}
      {/*
      {actionType == TaskActionType.regular_like_group &&
        <RegularLikeGroupInfoBlock />
      }
      */}
    </div>
  )
})
