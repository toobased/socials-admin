import { TaskDataInfo } from "@/components/tasks_data";
import { BotTasksContext } from "@/store/botsTasksStore";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const TaskDetailPage: NextPage = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const taskError = tasksStore.errors.tasksLoadingError
  const taskLoading = tasksStore.loaders.botTaskLoading

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (
      !(id) ||
      !(typeof id == 'string') ||
      (id === '') 
    ) {
      return
    }
    // load current bot
    tasksStore.getBotTaskByIdApi(id)
  }, [])

  if (taskError) {
    return (
      <div>
        task loading error...
        <div>
          { taskError }
        </div>
      </div>
    )
  }

  if (taskLoading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  return (
    <main>
      {/*
      <TaskMetrics />
      */}
      <TaskDataInfo />
    </main>
  )
})

export default TaskDetailPage
