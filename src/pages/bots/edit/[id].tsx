import CreateForm from "@/components/bots/CreateForm";
import { BotCreate } from "@/models/bots";
import { BotContext } from "@/store/botsStore";
import { errorMessage, successMessage } from "@/utils";
import { Button } from "antd";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const EditBot: NextPage = observer(() => {
  //context
  const botStore = useContext(BotContext);
  //
  const router = useRouter();
  const { id } = router.query
  const { newBot } = botStore;
  const { currentBot } = botStore;

  useEffect(() => {
    if (!(typeof id == 'string')) {
      return
    }
    botStore.getBotApi(id).then(() => {
      if (botStore.currentBot) {
        botStore.setNewBot(
          new BotCreate(botStore.currentBot as Partial<BotCreate>)
        )
      }
    })
  }, [])

  const saveBot = async () => {
    const [isSaved, msg] = [false, 'unavailable']
    // const [isSaved, msg] = await botStore.updateBotApi()
    console.log(isSaved, msg)
    if (isSaved){
      successMessage(msg)
      botStore.getBotsApi(true)
      router.push(`/bots/${currentBot?.id}`)
    } else {
      errorMessage(msg)
    }
  }

  const SaveBot = observer(() => {
    const loading = botStore.loaders.botCreationLoading
    return (
      <div>
        <Button
          disabled={!newBot.canBeCreated()}
          type="primary"
          loading={loading}
          onClick={() => saveBot()}
        >
          { loading ? "Loading..." : "Save bot"}
        </Button>
      </div>
    )
  })

  return (
    <main className="mx-11 my-7">
      <Title>
        Edit bot
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

export default EditBot
