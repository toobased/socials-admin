import { TaskActionForm } from "@/components/actions/TaskActionForm"
import { ActionFormConfig, ActionFormFieldType } from "@/models/action_form"
import { Bot, BotCreate } from "@/models/bots"
import { CreateFormStep } from "@/models/create_form_steps"
import { Button } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { BotView } from "../../BotView"

export interface TokenPickerStepProps {
    title: string
    placeholder?: string
    actionLabel: string
    value: () => any
    setter: (v: string) => void
    onAction: () => Promise<boolean>
    onNext?: (id: string) => void
}

export function TokenPickerStep(p: TokenPickerStepProps): CreateFormStep {
    const id = 'token-picker'
    const { title, value, setter, onAction, onNext } = p
    const component = observer(() => {
        const cfg = new ActionFormConfig({
            fields: [
                    {
                        field_type: ActionFormFieldType.InputString,
                        label: title,
                        placeholder: p.placeholder || '',
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
                        res && onNext && onNext(id)
                    }}>{p.actionLabel}</Button>
                </div>
            </div>
        )
    })
    return new CreateFormStep({ id, title: '', isFinal: false, Body: component })
}

export interface ConfirmBotStepProps {
    title: string
    actionLabel: string
    bot: BotCreate | Bot
    onNext?: (id: string) => void
}

export function ConfirmBotStep (p: ConfirmBotStepProps): CreateFormStep {
    const id = 'confirm-bot'
    const { title, actionLabel, bot, onNext } = p
    const component = observer(() => {
        return (
            <div>
                <div>{ title }</div>
                <div>
                    <BotView bot={bot} />
                    <Button onClick={async () => {
                        // const res = await onAction()
                        onNext && onNext(id)
                    }}>{actionLabel}</Button>
                </div>
            </div>
        )
    })
    return new CreateFormStep({ id, title: '', isFinal: false, Body: component })
}
