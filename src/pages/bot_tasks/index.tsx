import { NextPage } from "next";
import { observer } from 'mobx-react'
import router from "next/router";
import { Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BotTasksContext } from "@/store/botsTasksStore";

const TasksTable = observer(() => {
  const tasksStore = useContext(BotTasksContext)
  const tasksSearch = tasksStore.tasksSearch
  const tasks = tasksSearch.bot_tasks

  return (
    <div>
      <Table>
        <Thead>
          <Tr>
            <Th>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              asdfsdf
            </Td>
            <Td>
              asdfsdf
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  )
})

const AddNewTaskButton = () => {
  return (
    <Button
      onClick={() => router.push('bot_tasks/new')}
    >
      Add new task
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
      <div>
        loading...
      </div>
    )
  }
  return (
    <>
      <main className="mx-11 my-7">
        <div>
          <AddNewTaskButton />
        </div>
        {/* tasks table */}
        <TasksTable/>
        {/* eof tasks table */}
      </main>
    </>
  )
})


export default BotTasks
