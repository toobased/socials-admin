import { NextPage } from "next";
import { observer } from 'mobx-react'
import router, { useRouter } from "next/router";
import { Button, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Switch, Table, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BotTasksContext, BotTasksStore } from "@/store/botsTasksStore";
import BooleanComponent from "@/components/common/BooleanComponent";
import { errorMessageChakra, getFilterByLabel, shortStr, stringToDate, successMessageChakra, sweetyDate } from "@/utils";
import { Pagination } from "antd";
import { Icon } from "@iconify/react";
import OptionDropdownFilter from "@/components/common/OptionDropdownFilter";
import { platformFilters } from "@/models/bots";
import { PlatformEnum } from "@/models/enums/bots";
import { AppContext } from "@/store/appStore";
import TestingBadge from "@/components/common/TestingBadge";
import LoadingContainer from "@/components/common/LoadingContainer";
import { BotTask } from "@/models/bots_tasks";
import ErrorIcon from "@/components/common/ErrorIcon";

const TasksTablePagination = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const tasksSearch = tasksStore.tasksSearch
  const tasksSearchQuery = tasksStore.tasksSearchQuery

  const totalItems = tasksSearch.total
  const limit = tasksSearchQuery.limit
  const skip = tasksSearchQuery.skip
  const currentPage = tasksStore.currentPage

  return (
    <div className="mt-3 width-full justify-end flex">
      <Pagination
        current={currentPage}
        pageSize={limit}
        total={totalItems}
        onChange={(p: number) => {
          console.log('run on change')
          tasksStore.currentPage = p
          tasksSearchQuery.skip = 
            (tasksStore.currentPage-1) * limit
          tasksStore.getBotTasksApi(true)
        }}
      />
    </div>
  )
})

const TaskActionsBtn = observer((props: {
    task: BotTask,
    handleGoEditPage: (id: string) => void,
    handleDeleteTask: (id: string) => void
}) => {
    const { task, handleGoEditPage, handleDeleteTask } = props
      const appStore = useContext(AppContext)
    const isMobile = appStore.isMobile
    const btnSize = isMobile ? 'md' : 'md'
    return (
        <div>
            <div className="flex gap-2">
          <Menu>
            <MenuButton>
              <Button variant="outline" size={btnSize}>
                <Icon icon="charm:menu-meatball" />
              </Button>
            </MenuButton>
            <MenuList className="text-lg">
                <MenuItem
                  onClick={() => handleGoEditPage(task.id) }
                >
                  <div className="flex gap-3 items-center">
                    <Icon
                      icon="bxs:message-square-edit"
                      width="25"
                      className="block"
                    />
                    Редактировать
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() => handleDeleteTask(task.id) }
                >
                  <div
                    className="flex gap-3 items-center text-red-500">
                    <Icon
                      icon="fa6-solid:delete-left"
                      width="25"
                      className="block text-red-500"
                    />
                    Удалить
                  </div>
                </MenuItem>
            </MenuList>
          </Menu>
            {task.isFinished &&
                <div>
                    <Button
                        className=""
                        colorScheme="red"
                        size={btnSize}
                        onClick={() => handleDeleteTask(task.id)}
                    >
                        <Icon icon="material-symbols:delete-rounded" fontSize="18px" />
                    </Button>
                </div>
            }
          </div>
        </div>
    )
})

const TaskRow = observer((props: {
    task: BotTask,
    handleGoTaskDetail: (id: string) => void
    handleGoEditPage: (id: string) => void,
    handleDeleteTask: (id: string) => void
}) => {
    const { task, handleGoTaskDetail, handleDeleteTask, handleGoEditPage } = props
  const appStore = useContext(AppContext)

    return (
        <div className="bg-back2 rounded-lg p-4 relative max-w-xl mx-auto w-auto flex-shrink flex-grow mx-0 flex flex-col">
            <div className="flex-grow flex flex-col">

                <div className="flex justify-between mb-1">
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2">
                            {/* task status */}
                            <div className="font-semibold">
                              { task.status }
                            </div>
                            {/* eof task status */}

                            {/* task platform */}      
                            <div className="font-semibold">
                              { task.platform }
                            </div>
                            {/* eof task platform */}
                        </div>

                        <div className="flex gap-1 items-center">
                            {/* task type */}
                            <div className="bg-cyan-500 p-1 px-2 rounded-lg">
                              { task.action_type }
                            </div>
                            {/* eof task type */}

                            {/* task metrics */}
                            <div className="rounded-lg p-1 px-2 bg-indigo-400 font-bold text-sm max-w-max">
                              <div dangerouslySetInnerHTML={{__html: task.metricsLabel}} />
                            </div>
                            {/* eof task metrics */}
                        </div>
                    </div>

                    <div className="flex gap-1">
                    {/* TODO task has_error */}
                    { task.error != undefined &&
                        <div> <ErrorIcon /> </div>
                    }
                    {/* eof task has_error */}

                    <TaskActionsBtn
                        task={task}
                        handleDeleteTask={handleDeleteTask}
                        handleGoEditPage={handleGoEditPage}
                    />
                    </div>
                </div>

                <div className="flex my-2 gap-2">
                    {/* task title */}
                    <div
                      onClick={() => handleGoTaskDetail(task.id)}
                      className="font-semibold cursor-pointer">
                        <div>
                            {task.primaryImage &&
                                <img src={task.primaryImage} className="w-20 h-16 object-cover rounded-lg" />
                            }
                            {task.is_testing &&
                                <div className="absolute -top-3 right-0">
                                    <TestingBadge />
                                </div>
                            }
                        </div>
                    </div>
                    {/* eof task title */}

                    {/* task details */}
                    <div
                      onClick={() => handleGoTaskDetail(task.id)}
                      className="font-medium cursor-pointer relative text-sm">
                        <div>
                            <div>{task.title || ''}</div>
                            <Tooltip placement="top" label={task.details}>
                                <span className="flex max-w-xs overflow-hidden">{shortStr(task.details, 50)}</span>
                            </Tooltip>
                        </div>
                    </div>
                    {/* eof task detials */}
                </div>

            </div>


            <div className="text-xs md:text-sm bg-back3 rounded-md flex justify-between py-1 px-2 flex-col">
                {/* task next_time_run */}      
                <div>
                  <div className="flex justify-between gap-3">
                    <div>Next run: </div>
                  {task.next_run_time &&
                    <div>
                      {task.next_run_time.cntdwn_sweety(appStore.timestamp_now)}
                    </div>
                  }
                  {!task.next_run_time && <div> --- </div> }
                  </div>
                </div>
                {/* eof task next_time_run */}
                {/* task udated_date */}
                    <div className="flex justify-between gap-3">

                        <div>Last updated: </div>
                      <div>{task.date_updated?.elapsed_sweety(appStore.timestamp_now)}</div>
                    </div>
                {/* eof task updated_date */}
                {/* task created_date */}
                <div className="flex justify-between gap-3">
                    <div>Created elapsed: </div>
                      <div>{task.date_created?.elapsed_sweety(appStore.timestamp_now)}</div>
                </div>
                {/* eof task created_date */}
                {/* task created_date */}
                <div className="flex justify-between gap-3">
                    <div>Created normal: </div>
                    <div>{task.date_created?.normal } </div>
                </div>
                {/* eof task created_date */}
            </div>

        </div>
    )
})

const TasksTable = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const appStore = useContext(AppContext)
  const tasksSearch = tasksStore.tasksSearch
  const tasks = tasksSearch.bot_tasks
  const tasksLoading = tasksStore.loaders.botTasksLoading
  const tasksLoadingError = tasksStore.errors.tasksLoadingError

  const router = useRouter()

  const handleDeleteTask = async (id: string) => {
    const [isSuccess, msg] = await tasksStore.deleteBotTaskApi(id)
    if (isSuccess) {
      successMessageChakra(msg)
      tasksStore.getBotTasksApi(true)
    } else {
      errorMessageChakra(msg)
    }
  }

  const handleGoEditPage = async (id: string) => {
    router.push(`bot_tasks/edit/${id}`)    
  }

  const handleGoTaskDetail = async (id: string) => {
    router.push(`bot_tasks/${id}`)    
  }


  if (tasksLoadingError) {
    // TODO: replace with some error component
    return (
      <div>
        error while loading tasks
        {JSON.stringify(tasksLoadingError)}
      </div>
    )
  }

  if (tasksLoading) { return ( <LoadingContainer style={ { minHeight: '200px' } } /> ) }

  return (
    <div className="mt-4">
        <div className="flex flex-col md:flex-row flex-wrap gap-2">
            { tasks.map((task, i) => {
                return (
                    <TaskRow
                        key={i}
                        task={task}
                        handleGoTaskDetail={handleGoTaskDetail}
                        handleGoEditPage={handleGoEditPage}
                        handleDeleteTask={handleDeleteTask}
                    />
                )
            })}
        </div>
    </div>
  )
})

const AddNewTaskButton = () => {
  const appStore = useContext(AppContext)
  Comment
  return (
    <Button
      onClick={() => appStore.modals.setCreateTask(true)}
    >
      Добавить таск
    </Button>
  )
}

const ReloadTasksButton = () => {
  const tasksStore = useContext(BotTasksContext)
  Comment
  return (
    <Button
      onClick={() => 
        tasksStore.getBotTasksApi(true)
      }
    >
      <Icon icon="iconoir:refresh-double" />
    </Button>
  )
}

const ResetTasksButton = () => {
  const tasksStore = useContext(BotTasksContext)
  Comment
  return (
    <Button
      colorScheme="red"
      onClick={() => {
        tasksStore.tasksSearchQuery.resetDefaults()
        tasksStore.getBotTasksApi(true)
      }}
    >
      <Icon icon="carbon:filter-reset" />
    </Button>
  )
}

const BotTaskFilters = observer((
  { onLoadTasks } : {onLoadTasks: Function}
) => {
  const tasksStore = useContext(BotTasksContext);
  const filters = tasksStore.tasksSearchQuery;

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex gap-3">
        {/* Platform filter */}
        <div>
          <OptionDropdownFilter
            filterLabel="Platform filter"
            currentRaw={filters.platform}
            currentFilter={getFilterByLabel(filters.platform, platformFilters)}
            onValueSelect={(value: any) => {
              if (typeof value == 'string') {
                filters.platform = value as PlatformEnum
                onLoadTasks(true)
              }
            }}
            filterValues={platformFilters}
          />
        </div>
        {/* eof Platform filter */}
      </div>
      {/* Include hidden */}
      <div className="flex gap-2 items-center">
        <Icon icon="bx:hide" width="22" />
        <Switch
          isChecked={filters.include_hidden}
          onChange={_e => {
            filters.include_hidden = !filters.include_hidden
            onLoadTasks(true)
          }}
        />
      </div>
      {/* eof Include hidden */}
    </div>
  )
})


const BotTasks: NextPage = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const tasksLoading = tasksStore.loaders.botTasksLoading
  const tasksLoadingError = tasksStore.errors.tasksLoadingError

  const loadTasks = () =>
    tasksStore.getBotTasksApi(true)

  useEffect(() => {
    tasksStore.getBotTasksApi()
  }, [])


  return (
    <>
      <main className="mx-4 md:mx-11 my-7">
        <div className="flex flex-wrap gap-3">
          <AddNewTaskButton />
          <ReloadTasksButton />
          <ResetTasksButton />
        </div>
        <BotTaskFilters onLoadTasks={loadTasks} />
        {/* tasks table */}
        <TasksTable/>
        <TasksTablePagination />
        {/* eof tasks table */}
      </main>
    </>
  )
})


export default BotTasks
