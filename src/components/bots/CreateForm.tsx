import { countryFiltes, GenderEnum, IFilterValue, platformFilters } from "@/models/bots";
import { CountryEnum, PlatformEnum } from "@/models/enums/bots";
import { BotContext } from "@/store/botsStore";
import { Button, DatePicker, Input, Radio, Switch } from "antd"
import { observer } from "mobx-react"
import { useContext } from "react";
import InfoTooltip from "../common/InfoTooltip";
import OptionDropdownFilter from "../common/OptionDropdownFilter";
import AccessTokenVkHelper from "./AccessTokenVkHelper";

const CreateForm = () => {

  const platformOptions = Object.values(PlatformEnum)
  const genderOptions = Object.values(GenderEnum)

  const botStore = useContext(BotContext);
  const { newBot } = botStore;

  const currentPlatformFilter = (): IFilterValue | undefined => platformFilters.filter(
    (f) => f.query_value == newBot.platform
  )[0] || undefined

  const generatePassword = () =>
    Math.random().toString(36).slice(-12);

  const AccessTokenHelper = observer(() => {
    return (
      <div>
        {newBot.platform == PlatformEnum.Vk &&
          <AccessTokenVkHelper />
        }
      </div>
    )
  })

  const SelectPlatform = observer(() => (
      <>
      {/* PLATFORM SELECT */}
      <div>
        <OptionDropdownFilter
          filterLabel="Select platform"
          showServerLabel={false}
          currentFilter={currentPlatformFilter()}
          currentRaw={newBot.platform}
          filterValues={platformFilters}
          onValueSelect={(value: any) => {
            newBot.platform = value as PlatformEnum
          }}
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
      <div className="font-semibold text-md flex gap-2 items-center">
        <span>Provide username</span>
        <InfoTooltip 
          text={
            "Mostly it should be phone number 📱 u use when register"
          }
        />
      </div>
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
      className="flex justify-between max-w-xs p-3 rounded-lg"
    >
      <div>Is bot active</div>
      <Switch
        checked={newBot.make_ready}
        onChange={(value) => 
          newBot.make_ready = value
        }
      />
    </div>
    </>
  ))

  const SetBotResting = observer(() => {
    return (
      <>
      {/* bot resting */} 
      <div>
        <div className="font-semibold text-md flex gap-2 items-center">
          <span>Take a rest until</span>
          <InfoTooltip 
            text={
              "If u set bot not active and specify resting date, it will we waked up in this date and start to be active 🔥"
            }
          />
        </div>
        <div>
          {/*
          <DatePicker
            showTime
              newBot.rest_until = dateString
            }}
          />
          */}
        </div>
      </div>
      {/* eof bot resting */}
      </>
    )
  })

  return (
    <>
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
        <AccessTokenHelper />
      </div>
      <div className="max-w-md mt-2">
        <InputToken />
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <SetActive />
        <SetBotResting />
      </div>
      {/* EOF BOT FORM */}
    </>
  )
}

export default CreateForm
