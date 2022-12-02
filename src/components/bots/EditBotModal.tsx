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

export const EditBotModal = observer(() => {
    const appStore = useContext(AppContext)
    const botsStore = useContext(BotContext)
    const currentBot = botsStore.currentBotEdit
    const modals = appStore.modals

      useEffect(() => {
        initSteps()
      }, [])

    const initSteps = () => {
        const taskForm = new CreateFormSteps({
            nextSetter: (s) => botsStore.setCreateStep(s)
        })
        const taskSteps = [
            ActionDataFormStep({
                formConfig: () => currentBot?.form_config(),
                actionLabel: "Соxранить",
                onAction: async () => {
                    // add validation
                    await botsStore.updateBotApi(currentBot)
                    await botsStore.getBotsApi(true)
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

    const l = { modalTitle: "Редактирование бота" }
    const onClose = () => {
        modals.setEditBot(false)
        initSteps()
        botsStore.setCurrentBotEdit(undefined)
    }

    if (!currentStep) { return <>No current step</> }
    const CurrentStepBody = currentStep.Body

    return (
      <Modal size="4xl" isOpen={modals.edit_bot} onClose={() => onClose()} closeOnEsc={true} isCentered={true}>
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
            <div>{JSON.stringify(botsStore.currentBotEdit)}</div>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    )
})
