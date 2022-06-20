import { TaskTargetData } from "@/models/bots_tasks"
import { WorkLagEnum } from "@/models/enums/bot_tasks"
import { WatchVideoTargetData } from "@/models/tasks_watch_video"
import { TaskDateEndPicker } from "@/pages/bot_tasks/new"
import { BotTasksContext } from "@/store/botsTasksStore"
import { Heading, Input, NumberInput, NumberInputField, Select } from "@chakra-ui/react"
import { isNaN } from "lodash"
import { observer } from "mobx-react"
import { useContext } from "react"
import InfoTooltip from "../common/InfoTooltip"

const workLagLabel = 'Минимальное время для выполнения таска'
const workLagTooltip =
` Задача будет выполнена НЕ РАНЬШЕ чем за указанное время (или не раньше указанной даты) `
const videoLinkLabel = 'Ссылка на видео'
const videoLinkTooltip = 'Полная ссылка на видео'
const videoWatchCountLabel = 'Сколько накрутить просмотров'
const videWatchCountPlaceholder = 'Введите кол-во'
const videWatchCountTooltip = 'Указываешь кол-во, сколько нужно накрутить просмотров на видео '
const videoWatchSecondTooltip = `⌚Указываешь, сколько по времени бот каждый раз
будет смотреть видео (в секундах). Лимиты - минимум 5 секунд, максимум 30 минут. 30 минут = 1800 секунд
`
const videoWatchSecondLabel = 'Длительность просмотра'
const videWatchSecondPlaceholder = 'Укажит число (в секундах)'

const InputVideoLink = observer(({data }: {data: WatchVideoTargetData}) => {
  return (
    <div className="">
      <div className="font-semibold text-md mb-1 flex gap-2">
        { videoLinkLabel }
        <InfoTooltip 
          text={videoLinkTooltip}
        />
      </div>
      <Input 
        value={data.video_link}
        onChange={(e) => {
          data.video_link = e.target.value
        }}
      />
    </div>
  )
})

const InputVideoWatchCount = observer(({data }: {data: WatchVideoTargetData}) => {
  return (
    <div className="">
      <div className="font-semibold text-md mb-1 flex gap-2">
        { videoWatchCountLabel }
        <InfoTooltip 
          text={videWatchCountTooltip}
        />
      </div>
      <div>
      <NumberInput 
        value={data.watch_count}
        defaultValue={1}
        placeholder={videWatchCountPlaceholder}
        min={0}
        inputMode="numeric"
        onChange={(s, v) => {
if (isNaN(v)) { 
            data.watch_count = 0 
          } else {
            data.watch_count = v
          }
        }}
      >
        <NumberInputField>
        </NumberInputField>
      </NumberInput>
      </div>
    </div>
  )
})

const InputVideoWatchSecond = observer(({data }: {data: WatchVideoTargetData}) => {
  return (
    <div className="">
      <div className="font-semibold text-md mb-1 flex gap-2">
        { videoWatchSecondLabel }
        <InfoTooltip 
          text={videoWatchSecondTooltip }
        />
      </div>
      <div>
      <NumberInput 
        value={data.watch_second}
        defaultValue={20}
        placeholder={videWatchSecondPlaceholder}
        min={5}
        max={1800}
        inputMode="numeric"
        onChange={(s, v) => {
          if (isNaN(v)) { data.watch_second = 5 } else {
            data.watch_second = v
          }
        }}
      >
        <NumberInputField>
        </NumberInputField>
      </NumberInput>
      </div>
    </div>
  )
})


  const SelectWorkLag = observer(({data }: {data: WatchVideoTargetData}) => {
    return (
      <div className="">
        <div className="font-semibold text-md mb-1 flex gap-2">
          { workLagLabel }
          <InfoTooltip 
            text={workLagTooltip}
          />
        </div>
        <Select
          value={data.work_lag}
          onChange={(e) => {
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
    )
  })

export const WatchVideoCreateBlock = observer(() => {
  const taskStore = useContext(BotTasksContext)
  const taskData = taskStore.newTask.task_target_data
  const data: WatchVideoTargetData | undefined = taskData.watch_video

  if (!data) {
    return (
      <div>
        no regular like group data
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg px-4 py-6 mt-4">
      <Heading size="md" className="mb-2">
        Просмотры на видео
      </Heading>
        <div className="max-w-2xl">
          <InputVideoLink data={data} />
        </div>
        <div className="mt-2.5 flex gap-3 items-center">
          <InputVideoWatchCount data={data} />
          <InputVideoWatchSecond data={data} />
        </div>
        <div className="mt-2.5 max-w-md">
        <SelectWorkLag data={data} />
        </div>
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
  )
})

export const WatchVideoOverviewBlock = observer(() => {
  const taskStore = useContext(BotTasksContext)
  const data: WatchVideoTargetData | undefined = taskStore.currentTask?.task_target_data?.watch_video

  if (!data) {
    return (
      <div>
        no regular like group data
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg px-4 py-6 mt-4">
      <Heading size="md" className="mb-2">
        Просмотры на видео
      </Heading>
        <div className="max-w-2xl">
          <InputVideoLink data={data} />
        </div>
        <div className="mt-2.5 flex gap-3 items-center">
          <InputVideoWatchCount data={data} />
          <InputVideoWatchSecond data={data} />
        </div>
        <div className="mt-2.5 max-w-md">
        <SelectWorkLag data={data} />
        </div>
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
  )
})
