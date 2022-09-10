import { observer } from 'mobx-react'
import type { NextPage } from 'next'
import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '@/store/appStore'
import { BotContext } from '@/store/botsStore'
import { Select, Table } from 'antd'
import Column from 'antd/lib/table/Column'
// import { Icon } from '@iconify/react'
import CopyClipboardButton from '@/components/buttons/CopyClipboardButton'
import BooleanIcon from '@/components/common/BooleanIcon'
import { useRouter } from 'next/router'
import { activeFilters, BotSearchQuery, GenderEnum, genderFilters, IFilterValue, inUseFilters, platformFilters } from '@/models/bots'
import Link from 'next/link'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { Button, Menu, MenuButton, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Radio, RadioGroup } from '@chakra-ui/react'
import BooleanComponent from '@/components/common/BooleanComponent'
import { Icon } from '@iconify/react'
import ServerCallLabel from '@/components/common/ServerCallLabel'
import botsApi from '@/api/bots'
import { errorMessageChakra } from '@/utils'
import SelectMenuButton from '@/components/common/SelectMenuButton'
import SimpleLabel from '@/components/common/SimpleLabel'
import OptionDropdownFilter from '@/components/common/OptionDropdownFilter'
import { PlatformEnum } from '@/models/enums/bots'

const { Option } = Select

type BotsTableProps = {
  onLoadBots: Function
}

const tableSizes = [
  { value: "small", label: "small" },
  { value: "middle", label: "middle" },
  { value: "large", label: "large" },
]

const BotsTable = observer(({ onLoadBots }: BotsTableProps) => {
  const botStore = useContext(BotContext);

  const router = useRouter()
  // const router = useRouter()

  console.log('bots are', botStore.botSearch)
  const botQuery = botStore?.botSearchQuery
  const currentPage = botStore?.currentPage
  const total = botStore?.botSearch?.total
  const bots = botStore?.botSearch?.items

  // current filters
  const currentPlatformFilter = (): IFilterValue | undefined => platformFilters.filter((f) => f.query_value == botQuery.platform)[0] || undefined

  const currentGenderFilter = (): IFilterValue | undefined => genderFilters.filter((f) => f.query_value == botQuery.gender)[0] || undefined

  const currentActiveFilter = (): IFilterValue | undefined => activeFilters.filter((f) => f.query_value == botQuery.is_active)[0] || undefined

  const currentInUseFilter = (): IFilterValue | undefined => inUseFilters.filter((f) => f.query_value == botQuery.is_in_use)[0] || undefined

  const [tableSize, setTableSize] = useState(tableSizes[0].value)

  const [isTableLoading, setTableLoading] = useState(false)

  const handleGoEditPage = (id: string) => {
    router.push(`bots/edit/${id}`)
  }

  const handleGoDetailPage = (id: string) => {
    router.push(`bots/${id}`)
  }

  const handleCheckBanned = async (id: string) => {
    setTableLoading(true)
    const [isSuccess, msg] = await botStore.checkBannedApi(id)
    if (!isSuccess) {
      errorMessageChakra(msg)
      setTableLoading(false)
      return
    }
    botStore.getBotsApi(true)
    setTableLoading(false)
  }

  const getIsTableLoading = () => {
    if (
      isTableLoading ||
      botStore.botsLoading
    ) {
      return true
    }
    return false
  }
  //
  //
  const BotActionsBlock = ({ id }: { id: string }) => {
    return (
      <Menu>
        <MenuButton>
          <Button variant="outline">
            <Icon icon="charm:menu-meatball" />
          </Button>
        </MenuButton>
        <MenuList className="text-lg">
          <MenuItem
            onClick={() => handleGoDetailPage(id)}
          >
            <div className="flex gap-3 items-center">
              <Icon
                icon="bxs:message-square-detail"
                width="25"
                className="block"
              />
              Detail
            </div>
          </MenuItem>
          <MenuItem
            onClick={() => handleGoEditPage(id)}
          >
            <div className="flex gap-3 items-center">
              <Icon
                icon="bxs:message-square-edit"
                width="25"
                className="block"
              />
              Edit
            </div>
          </MenuItem>
          <MenuItem
            onClick={() => handleCheckBanned(id)}
          >
            <div className="flex justify-between gap-2">
              <div className="flex gap-2 items-center">
                <Icon
                  icon="majesticons:restricted-line"
                  width="25"
                  className="block"
                />
                Check banned
              </div>
              <div>
                <ServerCallLabel />
              </div>
            </div>
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }
  return (
    <>
      {/* RELOAD BUTTON */}
      <Button
        onClick={() => botStore.getBotsApi(true)}
      >
        reload
      </Button>
      {/* RESET FILTERS BUTTON */}
      <Button
        onClick={() => {
          botStore.botSearchQuery = new BotSearchQuery()
          botStore.getBotsApi(true)
        }}
      >
        Reset filters
      </Button>
      <div className="flex gap-5 mt-2">
        {/* PLATFORM FILTER */}
        <div>
          <OptionDropdownFilter
            filterLabel="Platform filter"
            currentRaw={botQuery.platform}
            currentFilter={currentPlatformFilter()}
            onValueSelect={(value: any) => {
              if (typeof value == 'string') {
                botQuery.platform = value
                onLoadBots(true)
              }
            }}
            filterValues={platformFilters}
          />
        </div>
        {/* EOF PLATFORM FILTER */}
        {/* GENDER FILTER */}
        <div>
          <OptionDropdownFilter
            filterLabel="Gender filter"
            currentRaw={botQuery.gender}
            currentFilter={currentGenderFilter()}
            onValueSelect={(value: any) => {
              if (typeof value == 'string') {
                botQuery.gender = value
                onLoadBots(true)
              }
            }}
            filterValues={genderFilters}
          />
        </div>
      </div>

      <div className="flex gap-5 mt-3">
        {/* ACTIVE FILTER */}
        <div>
          <OptionDropdownFilter
            filterLabel="Active filter"
            currentRaw={botQuery.is_active}
            currentFilter={currentActiveFilter()}
            onValueSelect={(value: any) => {
              if (typeof value == 'string') {
                botQuery.is_active = value
                onLoadBots(true)
              }
            }}
            filterValues={activeFilters}
          />
        </div>

        {/* IS IN USE FILTER */}
        <div>
          <OptionDropdownFilter
            filterLabel="In use filter"
            currentRaw={botQuery.is_active}
            currentFilter={currentInUseFilter()}
            onValueSelect={(value: any) => {
              if (typeof value == 'string') {
                botQuery.is_in_use = value
                onLoadBots(true)
              }
            }}
            filterValues={inUseFilters}
          />
        </div>
      </div>

      {/* TABLE SIZE */}
      <div className="mt-2">
        <div>Table size</div>
        <RadioGroup
          value={tableSize}
          onChange={(value) => {
            setTableSize(value)
          }}
        >
          {tableSizes.map((item, index) =>
            <Radio
              key={index}
              value={item.value}
            >
              {item.label}
            </Radio>
          )}
        </RadioGroup>
      </div>

      <Table
        className="mt-3"
        dataSource={bots}
        size={tableSize as SizeType}
        rowKey="id"
        loading={getIsTableLoading()}
        pagination={{
          total: total,
          pageSize: botQuery.limit,
          current: currentPage,
          size: "default",
          onChange: ((page: number) => {
            botStore.setCurrentPage(page)
            botQuery.offset = (page - 1) * (bots?.length || 10)
            onLoadBots(true)
          })
        }}
      >
        {/* USERNAME */}
        <Column
          title="Username"
          dataIndex="username"
          key="username"
          render={(username: string, record: any) => (
            <div className="cursor-pointer flex items-center">
              <div className="w-28 truncate">
                <Link
                  href={`/bots/${record.id}`}
                >
                  {username}
                </Link>
              </div>
              <CopyClipboardButton
                copyContent={username}
              />

            </div>
          )
          }
        />
        {/* PASSWORD*/}
        <Column
          title="Password"
          dataIndex="password"
          key="password"
          render={(password: string) => (
            <div className="cursor-pointer flex items-center z-10">
              <div className="w-20 truncate">
                {password}
              </div>
              <CopyClipboardButton
                copyContent={password}
              />

            </div>
          )
          }
        />
        {/* ACCESS_TOKEN */}
        <Column
          title="Access token"
          dataIndex="access_token"
          key="access_token"
          render={(access_token: string) => (
            <div className="cursor-pointer flex items-center">
              <div className="w-20 truncate">
                {access_token}
              </div>
              <CopyClipboardButton
                copyContent={access_token}
              />

            </div>
          )
          }
        />
        {/* CREATED DATE*/}
        <Column
          title="Created date"
          dataIndex="created_time"
          key="created_time"
          render={(created_time: string) => (
            <div className="cursor-pointer">
              <div className="">
                {new Date(created_time).toUTCString()}
                ({created_time})
              </div>
            </div>
          )
          }
        />
        {/* PLATFORM */}
        <Column
          title="Platform"
          dataIndex="platform"
          key="platform"
          render={(platform: PlatformEnum) => (
            <div className="cursor-pointer">
              <div className="">
                {platform}
              </div>
            </div>
          )
          }
        />
        {/* GENDER */}
        <Column
          title="Gender"
          dataIndex="gender"
          key="gender"
          render={(gender: GenderEnum) => (
            <div className="cursor-pointer">
              <div className="">
                {gender || '---'}
              </div>
            </div>
          )
          }
        />
        {/* IS ACTIVE */}
        <Column
          title="Active"
          dataIndex="is_active"
          key="is_active"
          render={(is_active: boolean) => (
            <div className="cursor-pointer">
              <BooleanIcon
                value={is_active}
              />
            </div>
          )
          }
        />
        {/* IS BANNED */}
        <Column
          title="Is banned"
          dataIndex="is_banned"
          key="is_banned"
          render={(is_banned: boolean) => (
            <div>
              <BooleanComponent
                value={is_banned}
                reverseEffect={true}
              />
            </div>
          )
          }
        />
        {/* IS RESTING */}
        <Column
          title="Is resting"
          dataIndex="is_resting"
          key="is_resting"
          render={(is_resting: boolean) => (
            <div>
              <BooleanComponent
                value={is_resting}
                negColor="#FBBF24"
                reverseEffect={true}
              />
            </div>
          )
          }
        />
        {/* BOT ACTIONS */}
        <Column
          title="Actions"
          dataIndex="bot_actions"
          key="bot_actions"
          render={(value: any, record: any) => (
            <div>
              <BotActionsBlock
                id={record.id as string}
              />
            </div>
          )
          }
        />
      </Table>
    </>
  )
})

const Bots: NextPage = observer(() => {
  // stores
  const router = useRouter();
  const botStore = useContext(BotContext);
  // states

  // parse route query
  const query = router.query

  useEffect(() => {
    if (query) {
      let searchQuery = new BotSearchQuery(query)
      botStore.botSearchQuery = searchQuery
      // load bots
      botStore.getBotsApi()
    }
  }, [])
  //
  if (botStore.botsLoadingError) {
    return (
      <>
        loading error?
      </>
    )
  }
  /*
  if (!botStore?.botSearch?.bots && !botStore.botsLoading) {
    return (
      <>
        loading...
      </>
    )
  }
  */

  return (
    <main className="mx-11 my-7">
      {/* RELOAD BUTTON */}
      <Button
        variant="solid"
        onClick={() => router.push('bots/new')}
      >
        Add new bot
      </Button>
      <div className="mt-3">
        <BotsTable
          onLoadBots={async () => {
            botStore.getBotsApi(true)
          }}
        />
      </div>
    </main>
  )
});

export default Bots
