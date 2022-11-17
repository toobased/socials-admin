import { ChooseItem } from "@/components/common/ChooseContainer"
import { CreateFormStep } from "@/models/create_form_steps"
import { BotTasksContext } from "@/store/botsTasksStore"
import { observer } from "mobx-react"
import { useContext } from "react"
import { SelectTargetStep } from "./default"

export const TaskActionStep = ((): CreateFormStep => {
    // const tasksStore = useContext(BotTasksContext)
    // const chooseTargetStep = SelectTargetStep()
    const component = observer(() => {
        // const newTask = tasksStore.newTask
        return (
            <div>
                content here
            </div>
        )
    })
    return new CreateFormStep({
        title: 'Выбери действие',
        Body: component
    })
})

