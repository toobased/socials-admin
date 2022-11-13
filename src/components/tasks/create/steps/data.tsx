import { TaskActionForm } from "@/components/actions/TaskActionForm"
import { SocialPostView } from "@/components/social/SocialPostView"
import { ActionFormConfig, ActionFormFieldType } from "@/models/action_form"
import { SocialPost } from "@/models/social/post"
import { BotTasksContext } from "@/store/botsTasksStore"
import { Button } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"
import { CreateTaskStep } from "../../CreateTaskModal"

export function ActionDataFormStep(): CreateTaskStep {
    const tasksStore = useContext(BotTasksContext)
    const component = observer(() => {
        const t = tasksStore.newTask
        const actionFormConfig = t.action.form_config(t.action_type)
        return (
            <div>
                {actionFormConfig &&
                    <div>
                        <TaskActionForm config={actionFormConfig} />
                    </div>
                }
            </div>
        )
    })
    return new CreateTaskStep({
        title: '',
        isFinal: true,
        Body: component
    })
}


export interface LinkPickerStepProps {
    title: string
    placeholdler?: string
    actionLabel: string
    value: () => any
    setter: (v: any) => void
    onAction: () => Promise<boolean>
}

export function LinkPickerStep(p: LinkPickerStepProps): CreateTaskStep {
    const tasksStore = useContext(BotTasksContext)
    const component = observer(() => {
        const t = tasksStore.newTask
        const actionFormConfig = t.action.form_config(t.action_type)
        const nextStep = ApprovePostStep()
        const cfg = new ActionFormConfig({
            fields: [
                    {
                        field_type: ActionFormFieldType.InputString,
                        label: p.title,
                        placeholder: p.placeholdler || '',
                        value: p.value,
                        setter: p.setter
                    },
                ]
            })
        return (
            <div>
                {actionFormConfig &&
                    <div>
                        <TaskActionForm config={cfg} />
                        <Button onClick={async () => {
                            const res = await p.onAction()
                            res && tasksStore.setCreateStep(nextStep)
                        }}>{p.actionLabel}</Button>
                    </div>
                }
            </div>
        )
    })
    return new CreateTaskStep({
        title: '',
        isFinal: false,
        Body: component
    })
}

export function ApprovePostStep(): CreateTaskStep {
    const tasksStore = useContext(BotTasksContext)
    const component = observer(() => {
        const t = tasksStore.newTask
        const nextStep = ActionDataFormStep()
        const p = t.action.currentPost(t.action_type)
        return (
            <div>
                {p &&
                    <div>
                        <div>
                            <SocialPostView post={p} />
                        </div>
                        <Button onClick={() => tasksStore.setCreateStep(nextStep)}>Далее</Button>
                    </div>
                }
            </div>
        )
    })
    return new CreateTaskStep({
        title: '',
        isFinal: false,
        Body: component
    })
}
