import { PlatformEnum } from "@/models/bots";
import { BotContext } from "@/store/botsStore";
import { Button, Radio } from "antd";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

const platformOptions = Object.values(PlatformEnum)

const NewBot: NextPage = observer(() => {
  //context
  const botStore = useContext(BotContext);
  //
  const router = useRouter();
  const { newBot } = botStore;

  /*
  useEffect(() => {
  })
  */

  return (
    <main className="mx-11 my-7">
      <Title>
        Create new Bot
      </Title>
      <div>
        new bot is { JSON.stringify(botStore.newBot) }
      </div>
      <div>
        <input
          value={newBot.test}
          onChange={(e) =>
            newBot.test = e.target.value
          }
        />
      </div>

      {/* PLATFORM SELECT */}
      <div>
        <div>Select platform</div>
        <Radio.Group
          options={platformOptions}
          value={newBot?.platform || platformOptions[0]}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            console.log(`value ${e.target.value}`)
            newBot.platform = e.target.value
            // botStore.setNewBot(botStore.newBot)
            console.log('new bot is', newBot)
            console.log('new bot store is ', botStore.newBot)
          }}
        />
      </div>
    </main>
  )
})

export default NewBot
