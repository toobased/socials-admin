import { WorkLagEnum } from "@/models/enums/bot_tasks"
import { RegularLikeGroupTargetData } from "@/models/tasks_regular_like"
import { BotTasksContext } from "@/store/botsTasksStore"
import { sweetyDate } from "@/utils"
import { Heading, Input, NumberInput, NumberInputField, Select } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"
import InfoTooltip from "../common/InfoTooltip"
import TaskDataTile from "../common/TaskDataTile"

export const RegularLikeGroupDataContent = observer((
  {data, isEditable = true } : {data: RegularLikeGroupTargetData, isEditable?: boolean }
) => {
  const disabled = !isEditable
  return (
    <div className="bg-white rounded-lg px-4 py-6 mt-4">
      <Heading size="md" className="mb-2">
        Постоянный лайк постов
      </Heading>
      {/* group id */}
      <div className="max-w-md">
        <div className="font-semibold text-md flex gap-2">
          <span>ID группы</span>
          <InfoTooltip 
            text={
              "Для вк это ID или сокращенное имя группы"
            }
          />
        </div>
        <Input
          className="mt-1"
          placeholder="Enter group id"
          value={data.group_id}
          disabled={disabled}
          onChange={(e) => {
            data.group_id = e.target.value
          }}
        />
      </div>
      {/* eof group id */}
      <div className="flex flex-wrap gap-3 items-center mt-3">
      {/* last posts check count */}
      <div className="">
        <div className="font-semibold text-md flex gap-2">
          Кол-во постов для проверки
          <InfoTooltip 
            text={
              `С указанной частотой интервала для проверки будет проверяться
              указанное здесь кол-во постов в группе/аккаунте. Для каждого поста,
              который ранее не был добавлен в задачу для лайка, будет создана 
              задача. Параметр нужно указывать исходя из того, как часто в группе/аккаунте
              размещаются посты. Для размещения < 10 постов в день нормальное значение
              в этом поле - 4, а частота проверки - 10 или 30 минут
              `
            }
          />
        </div>
        <NumberInput
          className="mt-1"
          placeholder="Enter line count"
          defaultValue={1}
          max={50}
          min={1}
          value={data.last_posts_check_count}
          isDisabled={disabled}
          onChange={(s:string, n: number) => {
            !n && (data.last_posts_check_count = undefined)
            n && (data.last_posts_check_count = n)
          }}
        >
          <NumberInputField>
          </NumberInputField>
        </NumberInput>
      </div>
      {/* last posts check count */}
      {/* like count */}
      <div className="">
        <div className="font-semibold text-md flex gap-2">
          Кол-во лайков
          <InfoTooltip 
            text={
              "Как много ❤️ нужно поставить для каждого поста"
            }
          />
        </div>
        <NumberInput
          className="mt-1"
          placeholder="Enter line count"
          defaultValue={1}
          value={data.like_count}
          isDisabled={disabled}
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
      {/* like random threshold */}
      <div className="">
        <div className="font-semibold text-md flex gap-2">
          Отклонение для кол-ва лайков
          <InfoTooltip 
            text={
              `Пример: Если значение лайков = 10, а отклонение = 5, тогда кол-во
              лайков поставится в рандомном интервале между
              (5;10).
              Для каждого поста будет рассчитываться свое рандомное значение
              `
            }
          />
        </div>
        <NumberInput
          className="mt-1"
          placeholder="5"
          defaultValue={5}
          value={data.like_random_threshold}
          isDisabled={disabled}
          onChange={(s:string, n: number) => {
            !n && (data.like_random_threshold = undefined)
            n && (data.like_random_threshold = n)
          }}
        >
          <NumberInputField>
          </NumberInputField>
        </NumberInput>
      </div>
      {/* eof like random threshold */}
      </div>
      <div className="flex flex-wrap gap-3 items-center mt-3">
        {/* check frequency select */}
        <div className="">
          <div className="font-semibold text-md mb-1 flex gap-2">
            Частота проверки постов
            <InfoTooltip 
              text={
                `⌛Как часто система будет проверять группу/аккаунт на наличие
                новых постов, которые нужно добавить в задачу для лайка
                `
              }
            />
          </div>
          <Select
            isDisabled={disabled}
            value={`${data.check_frequency}`}
            onChange={(e) => {
              data.check_frequency = e.target.value as WorkLagEnum
            }}
          >
            {Object.values(WorkLagEnum).map((item, index) =>
              <option 
                key={index} 
                value={item}
                disabled={item == WorkLagEnum.custom_date}
              >
                { item }
              </option>
            )}
          </Select>
        </div>
        {/* check frequency select */}
        {/* work lag select */}
        <div className="">
          <div className="font-semibold text-md mb-1 flex gap-2">
            Как долго ставить лайки на пост
            <InfoTooltip 
              text={
                `Указывается как долго будет выполнятся задача по лайку поста
                для каждого поста, для которого создана такая задача. Указывая
                этот параметр обращай внимание на кол-во лайков, что тебе нужно
                поставить. Чем больше нужно лайков - тем дольше задавай интервал
                `
              }
            />
          </div>
          <Select
            isDisabled={true}
            value={`${data.work_lag}`}
            onChange={(e) => {
              data.work_lag = e.target.value as WorkLagEnum
            }}
          >
            {Object.values(WorkLagEnum).map((item, index) =>
              <option 
                key={index} 
                value={`${item}`}
                disabled={item == WorkLagEnum.custom_date}
              >
                { item }
              </option>
            )}
          </Select>
        </div>
        {/* eof work lag select */}
      </div>
    </div>
  )
})

export const RegularLikeGroupCreateBlock = observer(() => {
  const taskStore = useContext(BotTasksContext)
  const taskData = taskStore.newTask.task_target_data
  const data = taskData.regular_like_group

  if (!data) {
    return (
      <div>
        no regular like group data
      </div>
    )
  }
  return <RegularLikeGroupDataContent data={data} />
})

export const RegularLikeGroupInfoBlock = observer(() => {
  const taskStore = useContext(BotTasksContext)
  const data = taskStore.currentTask?.task_target_data.regular_like_group

  if (!data) {
    return (
      <div>
        no regular like group data
      </div>
    )
  }
  return <RegularLikeGroupDataContent data={data} isEditable={false} />
})
