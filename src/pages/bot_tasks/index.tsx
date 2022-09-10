import { NextPage } from "next";
import { observer } from 'mobx-react'
import router, { useRouter } from "next/router";
import { Button, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Switch, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BotTasksContext, BotTasksStore } from "@/store/botsTasksStore";
import BooleanComponent from "@/components/common/BooleanComponent";
import { errorMessageChakra, getFilterByLabel, stringToDate, successMessageChakra, sweetyDate } from "@/utils";
import { Pagination } from "antd";
import { Icon } from "@iconify/react";
import OptionDropdownFilter from "@/components/common/OptionDropdownFilter";
import { platformFilters } from "@/models/bots";
import { PlatformEnum } from "@/models/enums/bots";

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

const TasksTableSkeleton = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const limit = tasksStore.tasksSearchQuery.limit
  return (
    <div className="rounded-lg py-3 px-3 mt-4">
      <Stack>
        {[...Array(limit)].map((index) => 
          <Skeleton 
            key={index}
            height="40px"
            rounded="xl"
          />
        )}
      </Stack>
    </div>
  )
})

const TasksTable = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const tasksSearch = tasksStore.tasksSearch
  const tasks = tasksSearch.bot_tasks
  const tasksLoading = tasksStore.loaders.botTasksLoading
  const tasksLoadingError = tasksStore.errors.tasksLoadingError

  const router = useRouter()

  const tableHeaderItems = [
    "Название", "Статус", "Активный",
    "Есть ошибка", "Платформа", "Тип таска", "Метрика",
    "Дата создания", "Updated date", "Следующая итерация", "Действия"
  ]

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

  if (tasksLoading) {
    return (
      <TasksTableSkeleton />
    )
  }

  return (
    <div 
      className="mt-4"
    >
      <Table
        className="rounded-lg"
      >
        <Thead>
          <Tr>
            { tableHeaderItems.map((item, index) =>
              <Th key={index}>
                { item }
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {/* tasks */}
            {tasks.map((task, index) =>
              <Tr
                key={index}
              >
                {/* task title */}      
                <Td
                  onClick={() => handleGoTaskDetail(task.id)}
                  className="font-semibold cursor-pointer">
                  { task.title }
                </Td>
                {/* eof task title */}
                {/* task status */}      
                <Td className="font-semibold">
                  { task.status }
                </Td>
                {/* eof task status */}
                {/* task is_active */}      
                <Td>
                  <BooleanComponent
                    value={task.is_active}
                    reverseEffect={false}
                  />
                </Td>
                {/* eof task is_active */}
                {/* task has_error */}      
                <Td>
                  <BooleanComponent
                    value={task.error != undefined}
                    reverseEffect={true}
                  />
                </Td>
                {/* eof task has_error */}
                {/* task platform */}      
                <Td className="font-semibold">
                  { task.platform }
                </Td>
                {/* eof task platform */}
                {/* task type */}      
                <Td>
                  { task.action_type }
                </Td>
                {/* eof task type */}
                {/* task type */}      
                <Td>
                  <div dangerouslySetInnerHTML={{__html: task.metricsLabel}} />
                </Td>
                {/* eof task type */}
                {/* task created_date */}      
                <Td className="min-w-max">
                    <div> {task.date_created?.normal } </div>
                  <div>({task.date_created?.elapsed_sweety})</div>
                </Td>
                {/* eof task created_date */}
                {/* task udated_date */}
                <Td>
                  <div>{task.date_updated?.elapsed_sweety}</div>
                </Td>
                {/* eof task updated_date */}
                {/* task next_time_run */}      
                <Td>
                  <div>
                  {task.next_run_time &&
                    <div>
                      {task.next_run_time.cntdwn_sweety}
                    </div>
                  }
                  {!task.next_run_time &&
                    <div>
                      ---
                    </div>
                  }
                  </div>
                </Td>
                {/* eof task next_time_run */}
                {/* action button */}
                <Td>
                  <Menu>
                    <MenuButton>
                      <Button variant="outline">
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
                </Td>
                {/* eof action button */}
              </Tr>
            )}
          {/* eof tasks */}
        </Tbody>
      </Table>
    </div>
  )
})

const AddNewTaskButton = () => {
  Comment
  return (
    <Button
      onClick={() => router.push('bot_tasks/new')}
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
      <main className="mx-11 my-7">
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
