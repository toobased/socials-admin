import { GenderEnum, PlatformEnum } from "@/models/bots";
import { BotContext } from "@/store/botsStore";
import { Button, Input, Radio, Switch } from "antd";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

const platformOptions = Object.values(PlatformEnum)
const genderOptions = Object.values(GenderEnum)

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
  const generatePassword = () =>
    Math.random().toString(36).slice(-12);

  const TestInfo = observer(() => (
    <div>
      { JSON.stringify(newBot) }
    </div>
  ))

  const SelectPlatform = observer(() => (
    <>
    {/* PLATFORM SELECT */}
    <div>
      <div>Select platform</div>
      <Radio.Group
        options={platformOptions}
        value={newBot.platform}
        optionType="button"
        buttonStyle="solid"
        onChange={(e) =>
          newBot.platform = e.target.value
        }
      />
    </div>
    </>
  ))

  const SelectGender = observer(() => (
    <>
    {/* GENDER SELECT */}
    <div>
      <div>Select gender</div>
      <Radio.Group
        options={genderOptions}
        value={newBot.gender}
        optionType="button"
        buttonStyle="solid"
        onChange={(e) =>
          newBot.gender = e.target.value
        }
      />
    </div>
    </>
  ))

  const InputUsername = observer(() => (
    <>
    {/* USERNAME */}
    <div>
      <div>Provide username</div>
      <Input
        placeholder="Username"
        value={newBot.username}
        onChange={(e) => 
          newBot.username = e.target.value
        }
      />
    </div>
    </>
  ))

  const InputPassword = observer(() => (
    <div>
    {/* PASSWORD */}
    <div>Provide password</div>
    <div className="flex">
      <Input
        placeholder="Password"
        value={newBot.password}
        onChange={(e) => 
          newBot.password = e.target.value
        }
      />
      <Button
        onClick={() => 
          newBot.password = generatePassword()
        }
      >
        Generate
      </Button>
    </div>
    </div>
  ))

  const InputToken = observer(() => (
    <>
    {/* TOKEN */}
    <div>
      <div>Provide Access token</div>
      <Input
        placeholder="Access token"
        value={newBot.access_token}
        onChange={(e) => 
          newBot.access_token = e.target.value
        }
      />
    </div>
    </>
  ))

  const SetActive = observer(() => (
    <>
    {/* IS ACTIVE */}
    <div 
      className="flex justify-between max-w-xs bg-white p-3 rounded-lg"
    >
      <div>Is bot active</div>
      <Switch
        checked={newBot.is_active}
        onChange={(value) => 
          newBot.is_active = value
        }
      />
    </div>
    </>
  ))

  const SetInUse = observer(() => (
    <>
    {/* IS IN USE */}
    <div
      className="flex justify-between max-w-xs bg-white p-3 rounded-lg"
    >
      <div>Is bot should be used</div>
      <Switch
        checked={newBot.is_in_use}
        onChange={(value) => 
          newBot.is_in_use = value
        }
      />
    </div>
    </>
  ))

  const SaveBot = observer(() => {
    const loading = botStore.loaders.botCreationLoading
    return (
      <div>
        <Button
          disabled={!newBot.canBeCreated()}
          type="primary"
          loading={loading}
          onClick={() => botStore.createBotApi()}
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

      <TestInfo />

      {/* BOT FORM */}
      <div className="flex flex-wrap gap-4">
        <SelectPlatform />
        <SelectGender />
      </div>
      <div className="mt-2 flex flex-wrap gap-4">
        <InputUsername />
        <InputPassword />
      </div>
      <div className="max-w-md mt-2">
        <InputToken />
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <SetActive />
        <SetInUse />
      </div>

      <div className="mt-3">
        <SaveBot />
      </div>
      {/* EOF BOT FORM */}

    </main>
  )
})

export default NewBot
