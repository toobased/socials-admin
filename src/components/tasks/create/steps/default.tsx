import { ChooseContainer, ChooseItem } from "@/components/common/ChooseContainer"
import { actionFilters, filtersToChooseItems, platformFilters, targetFilters } from "@/models/bots"
import { CreateFormStep } from "@/models/create_form_steps"
import { PlatformEnum } from "@/models/enums/bots"
import { TaskActionType, TaskTarget } from "@/models/enums/bot_tasks"
import { BotTasksContext } from "@/store/botsTasksStore"
import { observer } from "mobx-react"
import { useContext } from "react"
// import { ActionDataFormStep } from "./data"
//
export interface SelectPlatformStepProps {
    platformList: () => ChooseItem[]
    value?: () => any
    setter: (v: PlatformEnum) => void
    onNext?: (id: string) => void
}

export const SelectPlatformStep = ((p: SelectPlatformStepProps): CreateFormStep => {
    const id = 'select-platform'
    const { setter, platformList, onNext } = p
    const component = observer(() => {
        return (
            <div>
                <ChooseContainer
                    items={platformList()}
                    inline={true}
                    onChoose={(v) => {
                        setter(v.value)
                        onNext && onNext(id)
                    }}
                />
            </div>
        )
    })
    return new CreateFormStep({ id, title: 'Выбери платформу', Body: component })
})

export interface TaskActionStepProps {
    actionsList: () => ChooseItem[]
    value?: () => any
    setter: (v: TaskActionType) => void
    onNext?: (id: string) => void
}

export const TaskActionStep = ((p: TaskActionStepProps): CreateFormStep => {
    const id = 'select-task-action'
    const { setter, onNext, actionsList } = p
    const component = observer(() => {
        return (
            <ChooseContainer
                items={actionsList()}
                inline={true}
                onChoose={(v) => {
                    setter(v.value)
                    onNext && onNext(id)
                }}
            />
        )
    })
    return new CreateFormStep({ id, title: 'Выбери действие', Body: component })
})

export interface SelectTargetStepProps {
    targetsList: () => ChooseItem[]
    value?: () => any
    setter: (v: TaskTarget) => void
    onNext?: (id: string) => void
}

export const SelectTargetStep = ((p: SelectTargetStepProps): CreateFormStep => {
    const id = 'select-target'
    const { targetsList, setter, onNext } = p
    const component = observer(() => {
        return (
            <ChooseContainer
                items={targetsList()}
                inline={true}
                onChoose={(v) => {
                    setter(v.value)
                    onNext && onNext(id)
                }}
            />
        )
    })
    return new CreateFormStep({ id, title: 'Выбери таргет', Body: component })
})
