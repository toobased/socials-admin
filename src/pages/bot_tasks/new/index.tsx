import { NextPage } from "next";
import { observer } from 'mobx-react'
import router from "next/router";
import { Heading } from "@chakra-ui/react";

const NewBotTask: NextPage = observer(() => {
  return (
    <>
      <main className="mx-11 my-7">
        <Heading>
          Add new task
        </Heading>
      </main>
    </>
  )
})

export default NewBotTask 
