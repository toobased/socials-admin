import { ChooseContainer, ChooseItem } from "@/components/common/ChooseContainer"
import { actionFilters, filtersToChooseItems, platformFilters, targetFilters } from "@/models/bots"
import { PlatformEnum } from "@/models/enums/bots"
import { TaskTarget } from "@/models/enums/bot_tasks"
import { BotTasksContext } from "@/store/botsTasksStore"
import { observer } from "mobx-react"
import { useContext } from "react"
import { CreateTaskStep } from "../../CreateTaskModal"
import { ActionDataFormStep } from "./data"

export const TaskPlatformStep = ((): CreateTaskStep => {
    const tasksStore = useContext(BotTasksContext)
    const newTask = tasksStore.newTask

    const platformList: ChooseItem[] = filtersToChooseItems(
        platformFilters
            .filter(p => tasksStore.taskTypes
                .find(t => t.targets
                    .find(v => v.platforms.includes(p.query_value as PlatformEnum))
                )
            )
    )
    const component = observer(() => {
        const taskActionStep = TaskActionStep()
        return (
            <div>
                <ChooseContainer
                    items={platformList}
                    inline={true}
                    onChoose={(v) => {
                        newTask.withPlatform(v.value)
                        tasksStore.setCreateStep(taskActionStep)
                    }}
                />
            </div>
        )
    })
    return new CreateTaskStep({
        title: 'Выбери платформу',
        Body: component
    })
})

export const TaskActionStep = ((): CreateTaskStep => {
    const tasksStore = useContext(BotTasksContext)
    const chooseTargetStep = TaskTargetStep()
    const component = observer(() => {
        const newTask = tasksStore.newTask
        const actionsList: ChooseItem[] = filtersToChooseItems(actionFilters
            .filter(v => tasksStore.getActionsForPlatform(newTask.platform).includes(`${v.query_value}`))
        )
        return (
            <ChooseContainer
                items={actionsList}
                inline={true}
                onChoose={(v) => {
                    newTask.withActionType(v.value)
                    tasksStore.setCreateStep(chooseTargetStep)
                }}
            />
        )
    })
    return new CreateTaskStep({
        title: 'Выбери действие',
        Body: component
    })
})

export const TaskTargetStep = ((): CreateTaskStep => {
    const tasksStore = useContext(BotTasksContext)
    const component = observer(() => {
        const newTask = tasksStore.newTask
        // const s = ActionDataFormStep()
        const s = tasksStore.createTaskDataStep()?.()
        const targetsList: ChooseItem[] = filtersToChooseItems(
            targetFilters
            .filter(v =>
                tasksStore.getTargetsForPlatformAction(newTask.platform, newTask.action_type)
                .includes(v.query_value as TaskTarget)
            ))
        return (
            <ChooseContainer
                items={targetsList}
                inline={true}
                onChoose={(v) => {
                    newTask.withTarget(v.value)
                    s && tasksStore.setCreateStep(s)
                }}
            />
        )
    })
    return new CreateTaskStep({
        title: 'Выбери таргет',
        Body: component
    })
})
