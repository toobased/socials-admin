import { WorkLagEnum } from "@/models/enums/bot_tasks"
import { BotTasksContext } from "@/store/botsTasksStore"
import { sweetyDate } from "@/utils"
import { Heading, Input, NumberInput, NumberInputField, Select } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"
import InfoTooltip from "../common/InfoTooltip"
import TaskDataTile from "../common/TaskDataTile"

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

  return (
    <div className="bg-white rounded-lg px-4 py-6 mt-4">
      <Heading size="md" className="mb-2">
        Regular like group data 
      </Heading>
      {/* group id */}
      <div className="max-w-md">
        <div className="font-semibold text-md flex gap-2">
          <span>Group id</span>
          <InfoTooltip 
            text={
              "For vk its group id number"
            }
          />
        </div>
        <Input
          className="mt-1"
          placeholder="Enter group id"
          value={data.group_id}
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
          Last posts check count
          <InfoTooltip 
            text={
              "Specifies how much posts will be loaded to check for fresh one each time, when script is called. If u specify new posts check frequency around 10 minutes, normal value here is - 4-5 ✨"
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
          Like count
          <InfoTooltip 
            text={
              "How much ❤️ need to set for each post"
            }
          />
        </div>
        <NumberInput
          className="mt-1"
          placeholder="Enter line count"
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
      </div>
      <div className="flex flex-wrap gap-3 items-center mt-3">
        {/* check frequency select */}
        <div className="">
          <div className="font-semibold text-md mb-1 flex gap-2">
            New posts check frequency
            <InfoTooltip 
              text={
                "⌛How often script will load posts from group to check, is it smth fresh that needs to be liked"
              }
            />
          </div>
          <Select
            value={`${data.check_frequency}`}
            onChange={(e) => {
              data.check_frequency = e.target.value as WorkLagEnum
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
        {/* check frequency select */}
        {/* work lag select */}
        <div className="">
          <div className="font-semibold text-md mb-1 flex gap-2">
            How long to proces for each post
            <InfoTooltip 
              text={
                "You can specify the time that needs to achieve like_count on each post 😎"
              }
            />
          </div>
          <Select
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
