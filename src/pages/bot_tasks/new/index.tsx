import { NextPage } from "next";
import { observer } from 'mobx-react'
import router, { useRouter } from "next/router";
import { Button, Heading, Input, NumberInput, NumberInputField, Select } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BotTasksContext } from "@/store/botsTasksStore";
import { PlatformEnum } from "@/models/bots";
import { TaskTypeEnum, WorkLagEnum } from "@/models/enums/bot_tasks";
import { LikePostTargetData } from "@/models/bots_tasks";
import { DatePicker } from "antd";
import { errorMessageChakra, successMessageChakra } from "@/utils";

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


const LikePostDataBlock = observer(() => {
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
          placeholder="Enter post link"
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

const BotTaskAddButton = observer(() => {
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
        Create task
      </Button>
    </div>
  )
})

const BotTaskErrorContainer = observer(() => {
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

const BotTaskCreationForm = observer(() => {
  const botTasksStore = useContext(BotTasksContext)
  const task = botTasksStore.newTask

  const InputTaskTitle = observer(() => {
    return (
      <div className="max-w-md">
        <div className="font-semibold text-md mb-1">
          Task title (Optional)
        </div>
        <Input
          placeholder="Enter task title"
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
          Choose platform
        </div>
        <Select
          value={`${task.platform as string}`}
          onChange={(e) => {
            task.platform = e.target.value as PlatformEnum
          }}
          placeholder='Choose platform'
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
    return (
      <div>
        <div className="font-semibold text-md mb-1">
          Choose task type
        </div>
        <Select
          placeholder='Choose task type'
          value={task.task_type}
          onChange={(e) => {
            task.task_type = e.target.value as TaskTypeEnum
          }}
        >
          { Object.values(TaskTypeEnum).map((item, index) =>
            <option
              value={item}
              key={index}
            >
              {item}
            </option>
          )}
        </Select>
      </div>
    )
  })

  return (
    <div className="bg-white rounded-lg px-4 py-6">
      <Heading size="md" className="mb-2">
        Task general settings
      </Heading>
      <div className="mt-2">
      <InputTaskTitle />
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        <SelectPlatform />
        <SelectTaskType />
      </div>

    </div>
  )

})

const NewBotTask: NextPage = observer(() => {
  const botTasksStore = useContext(BotTasksContext)
  const task = botTasksStore.newTask
  return (
    <>
      <main className="mx-11 my-7">
        <Heading className="mb-4">
          Add new task
        </Heading>
        <BotTaskCreationForm />
        {task.task_type == TaskTypeEnum.like_post && 
          <LikePostDataBlock />
        }
        <BotTaskErrorContainer />
        <BotTaskAddButton />
      </main>
    </>
  )
})

export default NewBotTask 
