import { isErr } from "@/api/models/base"
import { Bot, filtersToChooseItems, platformFilters } from "@/models/bots"
import { CreateFormSteps } from "@/models/create_form_steps"
import { PlatformEnum } from "@/models/enums/bots"
import { AppContext } from "@/store/appStore"
import { BotContext } from "@/store/botsStore"
import { fireErr } from "@/utils"
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext, useEffect } from "react"
import { ChooseItem } from "../common/ChooseContainer"
import { ActionDataFormStep } from "../tasks/create/steps/data"
import { SelectPlatformStep } from "../tasks/create/steps/default"
import { ConfirmBotStep, TokenPickerStep } from "./create/steps/data"

export const CreateBotModal = observer(() => {
    const appStore = useContext(AppContext)
    const botsStore = useContext(BotContext)
    const newBot = botsStore.newBot
    const modals = appStore.modals

      useEffect(() => {
        botsStore.newBot.reset()
        initSteps()
      }, [])

    const initSteps = () => {
        const taskForm = new CreateFormSteps({
            nextSetter: (s) => botsStore.setCreateStep(s)
        })
        const taskSteps = [
            SelectPlatformStep({
                platformList,
                setter: (v: PlatformEnum) => newBot.withPlatform(v),
                onNext: (id: string) => taskForm.next(id)
            }),
            TokenPickerStep({
                title: "Укажи access token",
                placeholder: "access token here",
                actionLabel: "Далее",
                value: () => newBot.access_token,
                setter: (v: string) => { newBot.withAccessToken(v) },
                onNext: (id: string) => taskForm.next(id),
                onAction: async () => {
                    const res = await Bot.fetchByAccessToken(newBot.platform, newBot.access_token)
                    if (isErr(res)) { fireErr(res); return Promise.resolve(false) }
                    // console.log('tst run token on action', newBot.access_token, newBot.platform)
                    return Promise.resolve(true)
                }
            }),
            ConfirmBotStep({
                title: "Подтверждение бота",
                actionLabel: "Далее",
                bot: newBot,
                onNext: (id: string) => taskForm.next(id)
            }),
            ActionDataFormStep({
                formConfig: () => newBot.form_config(),
                actionLabel: "Создаем!",
                onAction: async () => {
                    // add validation
                    await botsStore.createBotApi()
                    onClose()
                }
            })
        ]
        taskForm.withSteps(taskSteps).init()
        botsStore.setCreateStep(taskForm.current)
    }

    const platformList = (): ChooseItem[] =>
        filtersToChooseItems(platformFilters, true)

    const currentStep = botsStore.createStep

    const l = { modalTitle: "Новый бот" }
    const onClose = () => {
        modals.setCreateBot(false)
        initSteps()
        botsStore.newBot.reset()
    }

    if (!currentStep) { return <>No current step</> }
    const CurrentStepBody = currentStep.Body

    return (
      <Modal size="4xl" isOpen={modals.create_bot} onClose={() => onClose()} closeOnEsc={true} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{ l.modalTitle }</ModalHeader>
          <ModalCloseButton />

          <ModalBody className="min-h-[400px]">
            <div>
                { currentStep.title }
            </div>
            <div className="font-semibold text-md mb-1">
                <CurrentStepBody />
            </div>
            {currentStep.isFinal &&
            <div>
                button here
            </div>
            }
            {
            <div>{JSON.stringify(botsStore.newBot)}</div>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    )
})
