import { Bot } from "@/models/bots";
import { BotContext } from "@/store/botsStore";
import { errorMessage, successMessage } from "@/utils";
import { observer } from 'mobx-react'
import { Button, Popconfirm } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import SimpleTile from "@/components/common/SimpleTile";
import ErrorBox from "@/components/common/ErrorBox";

const BotPage: NextPage = observer(() => {
  // store
  const botStore = useContext(BotContext)

  // states
  // const [bot, setBot] = useState<BotInterface>()

  const router = useRouter()
  const { id } = router.query
  const currentBot = botStore.currentBot

  const deleteBot = async () => {
    const [isSuccess, msg] = await botStore.deleteBotApi(botStore?.currentBot?.id || "")
    if (isSuccess) {
      successMessage(msg)
      await botStore.getBotsApi(true)
      router.push("/bots/")
    } else {
      errorMessage(msg)
    }
  }

  const goEditPage = async () => {
    router.push(`/bots/edit/${botStore?.currentBot?.id}`)
  }

  useEffect(() => {
    if (!(typeof id === 'string')) {
      return
    }
    botStore.getBotApi(id)
  }, [])

  if (!(typeof id === 'string')) {
    return (
      <>
        loading...
      </>
    )
  }

  if (botStore.loaders.currentBotLoading) {
    return (
      <>
        loading info...
      </>
    ) 
  }

  if (!currentBot) {
    return (
      <>
        not found bot with { id }
      </>
    )
  }

  const DeleteBotButton = () => (
    <>
      <Popconfirm
        placement="topLeft"
        title="Delete bot"
        okText="Yeap, delete"
        cancelText="Nope"
        onConfirm={() => deleteBot()}
      >
        <Button danger>
          Delete bot
        </Button>
      </Popconfirm>
    </>
  )

  const EditBotButton = () => (
    <>
      <Button
        type="primary"
        onClick={() => goEditPage()}
      >
        Edit bot
      </Button>
    </>
  )

  const BotCommonInfo = observer(() => {
    const createdDate = currentBot.date_created.sweety
    const lastUsedDate = currentBot.last_used?.sweety || '--'
    return (
      <div className="flex flex-col gap-2">
        { createdDate }
        <SimpleTile
          title="Created date"
          value={createdDate}
        />
        <SimpleTile
          title="Last used"
          value={createdDate}
        />
        <SimpleTile
          title="Id"
          value={currentBot.id}
        />
        <SimpleTile
          title="Username"
          value={currentBot.username}
        />
        <SimpleTile
          title="Password"
          value={currentBot.password}
        />
        <SimpleTile
          title="Access token"
          value={currentBot.access_token?.toString()}
        />
        <SimpleTile
          title="Platform"
          value={currentBot.platform}
          useClipboard={false}
        />
        <SimpleTile
          title="Gender"
          value={currentBot.gender}
          useClipboard={false}
        />
        { currentBot.error &&
            <ErrorBox
                kind={currentBot.error?.kind}
                msg={currentBot.error?.msg}
                detail={currentBot.error?.detail_msg}
            />
        }
      </div>
    )
  });

  return (
    <>
      <main>
      <div className="px-10 py-4">
        <div className="flex w-full justify-end gap-3">
          <EditBotButton />
          <DeleteBotButton />
        </div>
        <BotCommonInfo />
      </div>
      </main>
    </>
  )

})

export default BotPage
