import { ChooseItem } from "@/components/common/ChooseContainer"
import { BotTasksContext } from "@/store/botsTasksStore"
import { observer } from "mobx-react"
import { useContext } from "react"
import { CreateTaskStep } from "../../CreateTaskModal"
import { TaskTargetStep } from "./default"

export const TaskActionStep = ((): CreateTaskStep => {
    const tasksStore = useContext(BotTasksContext)
    const chooseTargetStep = TaskTargetStep()
    const component = observer(() => {
        const newTask = tasksStore.newTask
        return (
            <div>
                content here
            </div>
        )
    })
    return new CreateTaskStep({
        title: 'Выбери действие',
        Body: component
    })
})

