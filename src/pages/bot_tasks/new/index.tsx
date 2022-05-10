import { NextPage } from "next";
import { observer } from 'mobx-react'
import router, { useRouter } from "next/router";
import { Button, Checkbox, Heading, Input, NumberInput, NumberInputField, Select, Switch } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BotTasksContext } from "@/store/botsTasksStore";
import { PlatformEnum } from "@/models/bots";
import { TaskTypeEnum, WorkLagEnum } from "@/models/enums/bot_tasks";
import { CreateBotTask, LikePostTargetData } from "@/models/bots_tasks";
import { DatePicker } from "antd";
import { errorMessageChakra, successMessageChakra } from "@/utils";
import { RegularLikeGroupCreateBlock } from "@/components/tasks_data/regular_like_group";

interface TaskDateEndPickerProps {
  onDateChange: Function
}

const TaskDateEndPicker = (props: TaskDateEndPickerProps) => {
  return (
    <>
      <DatePicker
        showTime
        onChange={(value: any, dateString: string) => {
          props.onDateChange(dateString)
        }}
      />
    </>
  )
}


export const LikePostDataBlock = observer(() => {
  const botTasksStore = useContext(BotTasksContext)
  const taskData = botTasksStore.newTask.task_target_data
  const data = taskData.like_post

  if (!data) {
    return (
      <div>
        no like post data
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg px-4 py-6 mt-4">
      <Heading size="md" className="mb-2">
        Like Post data
      </Heading>
      {/* post link */}
      <div className="max-w-md">
        <div className="font-semibold text-md">Post link</div>
        <Input
          className="mt-1"
          placeholder="Enter post link"
          value={data.post_link}
          onChange={(e) => {
            data.post_link = e.target.value
          }}
        />
      </div>
      {/* eof post link */}
      <div className="flex flex-wrap gap-3 items-center mt-3">
      {/* like count */}
      <div className="">
        <div className="font-semibold text-md">Like count</div>
        <NumberInput
          className="mt-1"
          placeholder="Enter like count"
          defaultValue={1}
          value={data.like_count}
          onChange={(s:string, n: number) => {
            !n && (data.like_count = undefined)
            n && (data.like_count = n)
          }}
        >
          <NumberInputField>
          </NumberInputField>
        </NumberInput>
      </div>
      {/* eof like count */}
      {/* work lag select */}
      <div className="">
        <div className="font-semibold text-md">
          How long process the work
        </div>
        <Select
          value={`${data.work_lag}`}
          onChange={(e) => {
            const value = e.target.value
            value != WorkLagEnum.custom_date &&
              (data.date_finish.date = '')
            data.work_lag = e.target.value as WorkLagEnum
          }}
        >
          {Object.values(WorkLagEnum).map((item, index) =>
            <option 
              key={index} 
              value={`${item}`}
            >
              { item }
            </option>
          )}
        </Select>
      </div>
      {/* eof work lag select */}
      {/* date picker */}
      { data.work_lag == WorkLagEnum.custom_date && 
        <div className="mt-3">
          <TaskDateEndPicker
            onDateChange={(dateString: string) => {
              data.date_finish && (data.date_finish.date = dateString)
            }}
          />
        </div>
      }
      {/* eof date picker */}
      </div>
    </div>
  )

})

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
        onClick={e => createBotTask() }
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
  const botTasksStore = useContext(BotTasksContext)
  const task: CreateBotTask = botTasksStore.newTask

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

    const currentTaskTypes = () => {
      return taskTypes.filter((item) =>
        item.platforms.includes(task.platform)
      )
    }

    return (
      <div>
        <div className="font-semibold text-md mb-1">
          Выбери тип таска
        </div>
        <Select
          placeholder='Выбери тип таска'
          value={`${task.task_type}`}
          onChange={(e) => {
            task.task_type = e.target.value as TaskTypeEnum
          }}
        >
          { currentTaskTypes().map((item, index) =>
              <option
                value={item.id}
                key={index}
                disabled={!item.is_active}
              >
                {item.name}
              </option>
          )}
          {/* 
          { Object.values(TaskTypeEnum).map((item, index) =>
            <option
              value={item}
              key={index}
            >
              {item}
            </option>
          )}
          */}
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
    <div className="bg-white rounded-lg px-4 py-6">
      <Heading size="md" className="mb-2">
        Общие настройки для таска
      </Heading>
      <div className="mt-2">
      <InputTaskTitle />
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        <SelectPlatform />
        <SelectTaskType />
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
  const task = botTasksStore.newTask

  useEffect(() => {
    botTasksStore.getTasksTypes()
    botTasksStore.newTask.reset()
  }, [])
  return (
    <>
      <main className="mx-11 my-7">
        <Heading className="mb-4">
          Новый таск
        </Heading>
        <BotTaskCreationForm />
        {task.task_type == TaskTypeEnum.like_post && 
          <LikePostDataBlock />
        }
        {task.task_type == TaskTypeEnum.regular_like_group && 
          <RegularLikeGroupCreateBlock />
        }
        <BotTaskErrorContainer />
        <BotTaskAddButton />
      </main>
    </>
  )
})

export default NewBotTask 
