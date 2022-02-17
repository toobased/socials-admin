import { Bot } from "@/models/bots";
import { BotContext } from "@/store/botsStore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const BotPage: NextPage = () => {
  // store
  const botStore = useContext(BotContext)

  // states
  const [botLoading, setBotLoading] = useState(false)
  const [botLoaded, setBotLoaded] = useState(false)
  const [bot, setBot] = useState<Bot>()

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const loadInitialInfo = async () => {
      if (!(typeof id === 'string')) {
        return
      }
      if (!botLoading && !botLoaded) {
        // console.log('run bot loading...')
        setBotLoading(true)
        const bot = await botStore.getBotApi(id)
        if (bot) {
          setBot(bot)
        }
        setBotLoaded(true)
        setBotLoading(false)
      }
    }
    loadInitialInfo()
  })

  if (!(typeof id === 'string')) {
    return (
      <>
        loading...
      </>
    )
  }

  if (botLoading) {
    return (
      <>
        loading info...
      </>
    ) 
  }

  if (!bot) {
    return (
      <>
        not found
      </>
    )
  }

  return (
    <>
      id is { id }
      <div>
        { JSON.stringify(bot) }
      </div>
    </>
  )
}

export default BotPage
