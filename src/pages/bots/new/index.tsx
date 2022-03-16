import CreateForm from "@/components/bots/CreateForm";
import { BotContext } from "@/store/botsStore";
import { errorMessage, successMessage } from "@/utils";
import { Button } from "@chakra-ui/react";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const NewBot: NextPage = observer(() => {
  //context
  const botStore = useContext(BotContext);
  //
  const router = useRouter();
  const { newBot } = botStore;

  //
  useEffect(() => {
    botStore.resetNewBot()
  }, [])

  const createBot = async () => {
    const [isCreated, msg] = await botStore.createBotApi()
    console.log(isCreated, msg)
    if (isCreated){
      successMessage('bot created')
      await botStore.getBotsApi(true)
      router.push('/bots')
    } else {
      console.log('errro occurred', msg)
      errorMessage(msg)
    }
  }

  const SaveBot = observer(() => {
    const loading = botStore.loaders.botCreationLoading
    return (
      <div>
        <Button
          disabled={!newBot.canBeCreated()}
          variant="solid"
          isLoading={loading}
          onClick={() => createBot()}
        >
          { loading ? "Loading..." : "Create"}
        </Button>
      </div>
    )
  })

  return (
    <main className="mx-11 my-7">
      <Title>
        Create new Bot
      </Title>

      {/* BOT FORM */}
      <CreateForm />
      {/* EOF BOT FORM */}

      <div className="mt-3">
        <SaveBot />
      </div>

    </main>
  )
})

export default NewBot
