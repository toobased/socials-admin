import { TaskActionForm } from "@/components/actions/TaskActionForm"
import { SocialPostView } from "@/components/social/SocialPostView"
import { ActionFormConfig, ActionFormFieldType } from "@/models/action_form"
import { CreateFormStep } from "@/models/create_form_steps"
import { SocialPost } from "@/models/social/post"
import { Button } from "@chakra-ui/react"
import { observer } from "mobx-react"

export interface ActionDataFormStepProps {
    formConfig: () => ActionFormConfig | undefined
    actionLabel?: string
    onAction?: () => void
}

export function ActionDataFormStep(p: ActionDataFormStepProps): CreateFormStep {
    const { onAction, formConfig, actionLabel } = p
    const component = observer(() => {
        const cfg = formConfig()
        return (
            <div>
                {cfg &&
                    <div>
                        <TaskActionForm config={cfg} />
                    </div>
                }
                {onAction &&
                    <div>
                        <Button onClick={() => onAction()}>{actionLabel}</Button>
                    </div>
                }
            </div>
        )
    })
    return new CreateFormStep({
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
    onNext?: () => void
}

export function LinkPickerStep(p: LinkPickerStepProps): CreateFormStep {
    const id = 'link-picker'
    const { title, value, setter, onAction, onNext } = p
    const component = observer(() => {
        const cfg = new ActionFormConfig({
            fields: [
                    {
                        field_type: ActionFormFieldType.InputString,
                        label: title,
                        placeholder: p.placeholdler || '',
                        value: value,
                        setter: setter
                    },
                ]
            })
        return (
            <div>
                <div>
                    <TaskActionForm config={cfg} />
                    <Button onClick={async () => {
                        const res = await onAction()
                        res && onNext && onNext()
                    }}>{p.actionLabel}</Button>
                </div>
            </div>
        )
    })
    return new CreateFormStep({ id, title: '', isFinal: false, Body: component })
}

export interface ApprovePostStepProps {
    post?: () => SocialPost | undefined,
    onNext: () => void
}

export function ApprovePostStep(p: ApprovePostStepProps): CreateFormStep {
    const { post, onNext } = p
    const component = observer(() => {
        const p = post?.()
        return (
            <div>
                {p &&
                    <div>
                        <div>
                            <SocialPostView post={p} />
                        </div>
                        <Button onClick={() => {
                            onNext()
                        }}>Далее</Button>
                    </div>
                }
                {!post && <div>no post specified</div> }
            </div>
        )
    })
    return new CreateFormStep({
        title: '',
        isFinal: false,
        Body: component
    })
}
