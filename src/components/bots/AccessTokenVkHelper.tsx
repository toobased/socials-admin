import { BotContext } from "@/store/botsStore";
import { Button, Input } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext, useState } from "react";
import CopyClipboardButton from "../buttons/CopyClipboardButton"

const AccessTokenVkHelper = observer(() => {

  const botStore = useContext(BotContext);
  const bot = botStore.newBot;

  const [showData, setShowData] = useState(false)

  const appId = "7709111"
  const baseTokenLink = `https://oauth.vk.com/authorize?client_id=${appId}&redirect_uri=https://oauth.vk.com/blank.html&display=popup&scope=notify+friends+photos+status+wall+offline+groups+stats+email+market&response_type=token&revoke=1`
  const tokenLink = baseTokenLink

  const processTokenFromString = (v: string) => {
    const token = v.split("access_token=")?.[1]?.split("&")?.[0] ?? undefined
    if (!token) { 
      bot.access_token = ''
    }
    console.log('token is ', token)
    // set current token
    bot.access_token = token
  }

  const ProvideLinkButton = () =>
    <Button
      size="sm"
      onClick={() => setShowData(true)}
    >
      Get link for access token
    </Button>

  const TokenLink = () =>
    <div className="flex items-center my-1 max-w-max rounded-md py-2 px-3">
      <span>
        link is ready, click to copy
      </span>
      <CopyClipboardButton 
        copyContent={tokenLink}
      /> 
    </div>

  const ResponseTokenProcess = () => 
    <div>
      <Input
        size="sm"
        placeholder="paste response link here to help u process data"
        onChange={(e) => {
          const value = e.target.value
          processTokenFromString(value)
        }}
      />
    </div>

  return (
    <div>
      <div>
        <ProvideLinkButton />
        { showData &&
          <>
            <div className="mt-2">
              <TokenLink />
            </div>
            <div className="mt-2">
              <ResponseTokenProcess />
            </div>
          </>
        }
      </div>
    </div>
  )

})

export default AccessTokenVkHelper
