import { NextPage } from "next";
import { observer } from 'mobx-react'
import router, { useRouter } from "next/router";
import { Button, Menu, MenuButton, MenuItem, MenuList, Skeleton, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BotTasksContext } from "@/store/botsTasksStore";
import BooleanComponent from "@/components/common/BooleanComponent";
import { errorMessageChakra, stringToDate, successMessageChakra, sweetyDate } from "@/utils";
import { Pagination } from "antd";
import { Icon } from "@iconify/react";

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
    <div className="bg-white rounded-lg py-3 px-3 mt-4">
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
    "Title", "Status", "Is active",
    "Has error", "Platform", "Task type",
    "Created date", "Next time run", "Actions"
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
        className="bg-white rounded-lg"
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
                  { task.task_type }
                </Td>
                {/* eof task type */}
                {/* task created_date */}      
                <Td>
                  { sweetyDate(task.created_date) }
                </Td>
                {/* eof task created_date */}
                {/* task next_time_run */}      
                <Td>
                  <div>
                  {task.next_run_timestamp &&
                    <div>
                      { new Date(task.next_run_timestamp * 1000).
                      toUTCString()}
                    </div>
                  }
                  {!task.next_run_timestamp &&
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
                            Edit
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
                            Delete
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
      Add new task
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
      Reload tasks
    </Button>
  )
}

const BotTasks: NextPage = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const tasksLoading = tasksStore.loaders.botTasksLoading
  const tasksLoadingError = tasksStore.errors.tasksLoadingError

  useEffect(() => {
    tasksStore.getBotTasksApi()
  }, [])


  return (
    <>
      <main className="mx-11 my-7">
        <div className="flex flex-wrap gap-3">
          <AddNewTaskButton />
          <ReloadTasksButton />
        </div>
        {/* tasks table */}
        <TasksTable/>
        <TasksTablePagination />
        {/* eof tasks table */}
      </main>
    </>
  )
})


export default BotTasks
