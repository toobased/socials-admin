import { NextPage } from "next";
import { observer } from 'mobx-react'
import { useRouter } from "next/router";
import { Button, Checkbox, Heading, Input, NumberInput, NumberInputField, Select, Switch } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BotTasksContext } from "@/store/botsTasksStore";
import { TaskActionType, TaskTarget, WorkLagEnum } from "@/models/enums/bot_tasks";
import { CreateBotTask, LikePostTargetData, TaskActionEnum } from "@/models/bots_tasks";
import { DatePicker } from "antd";
import { errorMessageChakra, successMessageChakra } from "@/utils";
import { PlatformEnum } from "@/models/enums/bots";
import { TaskActionForm } from "@/components/actions/TaskActionForm";
import { ActionFormConfig } from "@/models/action_form";
import { WatchAction } from "@/models/actions/watch";
import { SourceStoreContext } from "@/store/socialSourcesStore";

export interface TaskDateEndPickerProps {
  onDateChange: Function
}

export const TaskDateEndPicker = (props: TaskDateEndPickerProps) => {
  return (
    <>
      <DatePicker
        showTime
        onChange={(_value: any, dateString: string) => {
          props.onDateChange(dateString)
        }}
      />
    </>
  )
}
export const BotTaskAddButton = observer(() => {
  const router = useRouter()

  const botTasksStore = useContext(BotTasksContext)
  const task = botTasksStore.newTask
  const currentBotTaskLoading = botTasksStore.loaders.currentBotTaskLoading

  const createBotTask = async () => {
    if (!task.isValid() ) {
      errorMessageChakra('Task is not valid')
      return null
    }
    const [isValid, msg] = await botTasksStore.createBotTaskApi()
    if (isValid) {
      successMessageChakra(msg)
      router.push('/bot_tasks')
      await botTasksStore.getBotTasksApi(true)
      return
    }
    errorMessageChakra(msg)
  }
  return (
    <div className="mt-4">
      <Button
        disabled={!task.isValid()}
        isLoading={currentBotTaskLoading}
        loadingText="Creating"
        onClick={_e => createBotTask() }
      >
        Создать таск
      </Button>
    </div>
  )
})

export const BotTaskErrorContainer = observer(() => {
  const botTasksStore = useContext(BotTasksContext)
  const taskCreationError = botTasksStore.errors.taskCreationError

  if (taskCreationError) {
    return (
      <div className="mt-2">
        error is { taskCreationError }
      </div>
    )
  }

  return (
    <>
    </>
  )
})

export const BotTaskCreationForm = observer(() => {
  const sourcesStore = useContext(SourceStoreContext)
  const botTasksStore = useContext(BotTasksContext)
  const task: CreateBotTask = botTasksStore.newTask
  const sources = sourcesStore.sourcesSearch.items

  const SetTaskTest = observer(() => {
    return (
      <div className="max-w-md">
        <div className="font-semibold text-md flex gap-2">
          <span>Таск тестовый</span>
        </div>
        <Switch
          className="mt-1"
          isChecked={task.is_testing}
          onInput={() =>
            task.is_testing = !task.is_testing
          }
        />
      </div>
    )
  })

  const InputTaskTitle = observer(() => {
    return (
      <div className="max-w-md">
        <div className="font-semibold text-md mb-1">
          Название для таска (не обязательно)
        </div>
        <Input
          placeholder="Введи название таска"
          value={task.title}
          onChange={(e) => {
            task.title = e.target.value
          }}
        />
      </div>
    )
  })

  const SelectResource = observer(() => {
    return (
      <div>
        <div className="font-semibold text-md mb-1">
          Выбери ресурс
        </div>
        <Select
          value={`${task.social_source_id}`}
          onChange={e =>
            task.social_source_id = e.target.value
          }
          placeholder='Выбери ресурс'
        >
          {sources.map((s, i) =>
            <option key={i} value={s.id}>
              {s.name}
            </option>
          )}
        </Select>
      </div>
    )
  })

  const SelectPlatform = observer(() => {
    return (
      <div>
        <div className="font-semibold text-md mb-1">
          Выбери платформу
        </div>
        <Select
          value={`${task.platform as string}`}
          onChange={(e) => {
            task.platform = e.target.value as PlatformEnum
            task.action_type = TaskActionType.Dummy
            task.action = new TaskActionEnum()
          }}
          placeholder='Выбери платформу'
        >
          { Object.values(PlatformEnum).map((item, index) =>
            <option key={index} value={item}>
              {item}
            </option>
          )}
        </Select>
      </div>
    )
  })

  const SelectTaskType = observer(() => {
    const taskTypes = botTasksStore.taskTypes
    if (taskTypes == undefined) {
      return (<></>)
    }

    function currentTaskTypes () {
      return taskTypes.filter((item) =>
        item.targets.filter(i => i.platforms.includes(
          task.platform
        )).length > 0
      )
    }

    return (
      <div>
        <div className="font-semibold text-md mb-1">
          Выбери тип таска
        </div>
        <Select
          placeholder='Выбери тип таска'
          value={`${task.action_type}`}
          onChange={(e) => {
            const t = e.target.value as TaskActionType
            task.action_type = t
            task.action.from_action_type(t)
          }}
        >
          { currentTaskTypes().map((item, index) =>
              <option
                value={item.action_type}
                key={index}
                disabled={!item.is_active}
              >
                {item.name}
              </option>
          )}
        </Select>
      </div>
    )
  })

  const SelectTaskTarget = observer(() => {
    const taskTypes = botTasksStore.taskTypes
    if (taskTypes == undefined) {
      return (<></>)
    }

    function currentTaskTargets (): TaskTarget[] {
      return taskTypes.find((item) =>
        item.action_type == task.action_type &&
        item.targets.filter(i => i.platforms.includes(
          task.platform
        )).length > 0
      )?.targets.map(t => t.target) || []
    }

    return (
      <div>
        <div className="font-semibold text-md mb-1">
          Выбери таргет таска
        </div>
        <Select
          placeholder='Выбери таргет таска'
          value={`${task.action.target}`}
          onChange={(e) => {
            const t = e.target.value as TaskTarget
            task.action.setTarget(t)
          }}
        >
          { currentTaskTargets().map((item, index) =>
              <option
                value={item}
                key={index}
                disabled={false}
              >
                {item}
              </option>
          )}
        </Select>
      </div>
    )
  })

  const SelectTaskActive = observer(() => {
    return (
      <div>
        <div className="font-semibold text-md mb-1">
          Таск активный
        </div>
        <Switch
          size="md"
          isChecked={task.is_active}
          onInput={() => {
            task.is_active = !task.is_active
          }}
        /> 
      </div>
    )
  })

  return (
    <div className="rounded-lg px-4 py-6">
      <Heading size="md" className="mb-2 dark:text-white">
        Общие настройки для таска
      </Heading>
      <div className="mt-2">
      <InputTaskTitle />
      </div>
      <div className="mt-2 max-w-md">
        <SelectResource />
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        <SelectPlatform />
        <SelectTaskType />
        <SelectTaskTarget />
      </div>
      <div className="mt-2 flex gap-3 items-center">
        <SelectTaskActive />
        <SetTaskTest />
      </div>

    </div>
  )
})

const NewBotTask: NextPage = observer(() => {
  const botTasksStore = useContext(BotTasksContext)
  const sourceStore = useContext(SourceStoreContext)
  const task = botTasksStore.newTask

  useEffect(() => {
    botTasksStore.getTasksTypes()
    botTasksStore.newTask.reset()
    if (sourceStore.sourcesSearch.items.length == 0) {
      sourceStore.getSources()
    }
  }, [])
  const actionFormConfig = task.action?.form_config(task.action_type)

  return (
    <>
      <main className="mx-11 my-7">
        <Heading className="mb-4 dark:text-white">
          Новый таск
        </Heading>
        <BotTaskCreationForm />

        action is { JSON.stringify(task.action) }

        {actionFormConfig &&
        <TaskActionForm config={actionFormConfig} />
        }

        <BotTaskErrorContainer />
        <BotTaskAddButton />
      </main>
    </>
  )
})

export default NewBotTask 
