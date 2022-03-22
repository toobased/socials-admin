import { CreateBotTask } from "@/models/bots_tasks"
import { TaskTypeEnum } from "@/models/enums/bot_tasks"
import { BotTasksContext } from "@/store/botsTasksStore"
import { errorMessageChakra, successMessageChakra } from "@/utils"
import { Button, Heading } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { BotTaskAddButton, BotTaskCreationForm, BotTaskErrorContainer, LikePostDataBlock } from "../new"

export const BotTaskUpdateButton = observer(() => {
  const router = useRouter()
  const botTasksStore = useContext(BotTasksContext)
  const task = botTasksStore.newTask
  const currentBotTaskLoading = botTasksStore.loaders.currentBotTaskLoading

  const updateBotTask = async () => {
    if (!task.isValid() ) {
      errorMessageChakra('Task is not valid')
      return null
    }
    const [isValid, msg] = await botTasksStore.updateBotTaskApi()
    if (isValid) {
      successMessageChakra(msg)
      router.push('/bot_tasks')
      await botTasksStore.getBotTasksApi(true)
      return
    }
    errorMessageChakra(msg)
  }
  return (
    <div className="mt-4">
      <Button
        disabled={!task.isValid()}
        isLoading={currentBotTaskLoading}
        loadingText="Saving..."
        onClick={e => updateBotTask() }
      >
        Save task
      </Button>
    </div>
  )
})

const EditBotTask: NextPage = observer(() => {
  const botTasksStore = useContext(BotTasksContext)
  const { newTask } = botTasksStore
  const currentBotTaskLoading = botTasksStore.loaders.currentBotTaskLoading
  const taskLoadingError = botTasksStore.errors.taskLoadingError

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

    botTasksStore.newTask.reset()
    botTasksStore.getBotTaskByIdApi(id).then(() => {
      console.log('current task is', botTasksStore.currentTask)
      if (botTasksStore.currentTask) {
        const newTask = new CreateBotTask(botTasksStore.currentTask)
        botTasksStore.setNewTask(newTask)
      }
    })
  }, [])

  if (currentBotTaskLoading) {
    return (
      <div>
        loading...
      </div> 
    )
  }

  if (taskLoadingError) {
    return (
      <div>
        error while loading task 
      </div> 
    )
  }



  return (
    <>
      <main className="mx-11 my-7">
        <Heading className="mb-4">
          Edit task
        </Heading>

        <BotTaskCreationForm />
        {newTask.task_type == TaskTypeEnum.like_post && 
          newTask.task_target_data.like_post &&
          <LikePostDataBlock />
        }
        <BotTaskErrorContainer />
        <BotTaskUpdateButton />
      </main>
    </>
  )

})




export default EditBotTask
