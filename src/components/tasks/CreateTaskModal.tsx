import { actionFilters, filtersToChooseItems, platformFilters, targetFilters } from "@/models/bots"
import { CreateFormSteps } from "@/models/create_form_steps"
import { PlatformEnum } from "@/models/enums/bots"
import { TaskActionType, TaskTarget } from "@/models/enums/bot_tasks"
import { AppContext } from "@/store/appStore"
import { BotTasksContext } from "@/store/botsTasksStore"
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext, useEffect } from "react"
import { ChooseItem } from "../common/ChooseContainer"
import { BotTaskAddButton } from "./create/base"
import { SelectPlatformStep, SelectTargetStep, TaskActionStep } from "./create/steps/default"

export const CreateTaskModal = observer(() => {
    const appStore = useContext(AppContext)
    const tasksStore = useContext(BotTasksContext)
    const newTask = tasksStore.newTask
    const modals = appStore.modals

      useEffect(() => {
        tasksStore.getTasksTypes()
        tasksStore.newTask.reset()
        initSteps()
      }, [])

    const initSteps = () => {
        const taskForm = new CreateFormSteps({
            nextSetter: (s) => tasksStore.setCreateStep(s)
        })
        const taskSteps = [
            SelectPlatformStep({
                platformList,
                setter: (v: PlatformEnum) => newTask.withPlatform(v),
                onNext: (id: string) => taskForm.next(id)
            }),
            TaskActionStep({
                actionsList,
                setter: (v: TaskActionType) => newTask.withActionType(v),
                onNext: (id: string) => taskForm.next(id)
            }),
            SelectTargetStep({
                targetsList,
                setter: (v: TaskTarget) => newTask.withTarget(v),
                onNext: (id: string) => {
                    const next = tasksStore.createTaskDataStep()
                    if (!next) { return }
                    taskForm.steps.push(next)
                    taskForm.next(id)
                }
            })
        ]
        taskForm.withSteps(taskSteps).init()
        tasksStore.setCreateStep(taskForm.current)
    }

    const platformList = (): ChooseItem[] =>
        filtersToChooseItems(
            platformFilters
                .filter(p => tasksStore.taskTypes
                    .find(t => t.targets
                        .find(v => v.platforms.includes(p.query_value as PlatformEnum))
                    )
                )
        )

    const actionsList = (): ChooseItem[] =>
        filtersToChooseItems(actionFilters
            .filter(v => tasksStore.getActionsForPlatform(newTask.platform).includes(`${v.query_value}`))
        )

    const targetsList = (): ChooseItem[] =>
        filtersToChooseItems(
            targetFilters
            .filter(v =>
                tasksStore.getTargetsForPlatformAction(newTask.platform, newTask.action_type)
                .includes(v.query_value as TaskTarget)
            )
        )

    const currentStep = tasksStore.createStep
    // if (currentStep == null) { }

    const l = { addTask: "Новый таск" }
    const onClose = () => {
        modals.setCreateTask(false)
        // tasksStore.setCreateStep(null)
        initSteps()
        tasksStore.newTask.reset()
    }

    if (!currentStep) {
        return <>No current step</>
    }

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
