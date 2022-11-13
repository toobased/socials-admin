import { AppContext } from "@/store/appStore"
import { BotTasksContext } from "@/store/botsTasksStore"
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"
import { BotTaskAddButton } from "./create/base"
import { TaskPlatformStep } from "./create/steps/default"

export class CreateTaskStep {
    title: string = ''
    needConfirm: boolean = false
    isFinal: boolean = false
    Body!: () => JSX.Element

    constructor(p: Partial<CreateTaskStep>) { Object.assign(this, p)}
}

export const CreateTaskModal = observer(() => {
    const appStore = useContext(AppContext)
    const tasksStore = useContext(BotTasksContext)
    const modals = appStore.modals

    const currentStep = tasksStore.createStep

    const taskPlatformStep = TaskPlatformStep()

    if (currentStep == null) { tasksStore.setCreateStep(taskPlatformStep) }

    const l = { addTask: "Новый таск" }
    const onClose = () => {
        modals.setCreateTask(false)
        tasksStore.setCreateStep(null)
        tasksStore.newTask.reset()
    }


    if (!currentStep) { return <></>}
    const CurrentStepBody = currentStep.Body

    return (
      <Modal size="4xl" isOpen={modals.create_task} onClose={() => onClose()} closeOnEsc={true} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{ l.addTask }</ModalHeader>
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
                <BotTaskAddButton callback={() => onClose()}/>
            </div>
            }
            {/*
            <div>{JSON.stringify(tasksStore.newTask)}</div>
            */}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
})
