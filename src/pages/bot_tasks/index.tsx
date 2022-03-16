import { NextPage } from "next";
import { observer } from 'mobx-react'
import router from "next/router";
import { Button } from "@chakra-ui/react";

const BotTasks: NextPage = observer(() => {
  return (
    <>
      <main className="mx-11 my-7">
        <AddNewTaskButton />
      </main>
    </>
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

export default BotTasks
