import { AppContext } from "@/store/appStore"
import { BotTasksContext } from "@/store/botsTasksStore"
import { errorMessageChakra, successMessageChakra } from "@/utils"
import { Button } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useRouter } from "next/router"
import { useContext } from "react"

export const BotTaskAddButton = observer((p: {callback: () => void}) => {
  const router = useRouter()

  const tasksStore = useContext(BotTasksContext)
  const appStore = useContext(AppContext)
  const task = tasksStore.newTask
  const currentBotTaskLoading = tasksStore.loaders.currentBotTaskLoading

  const createBotTask = async () => {
    if (!task.isValid() ) {
      errorMessageChakra('Task is not valid')
      return null
    }
    const [isValid, msg] = await tasksStore.createBotTaskApi()
    if (isValid) {
      successMessageChakra(msg)
        p.callback()
      router.push('/bot_tasks')
      await tasksStore.getBotTasksApi(true)
      return
    }
    errorMessageChakra(msg)
  }
  return (
    <div className="mt-4">
      <Button
        disabled={!task.isValid()}
        isLoading={currentBotTaskLoading}
        loadingText="Creating"
        onClick={_e => createBotTask() }
      >
        Создать таск
      </Button>
    </div>
  )
})
