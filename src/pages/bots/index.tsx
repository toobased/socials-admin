import { observer } from 'mobx-react'
import type { NextPage } from 'next'
import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { AppContext } from '@/store/appStore'
import { BotContext } from '@/store/botsStore'
import { Button, Radio, Select, Table, Tooltip } from 'antd'
import Column from 'antd/lib/table/Column'
import { Icon } from '@iconify/react'
import CopyClipboardButton from '@/components/buttons/CopyClipboardButton'
import BooleanIcon from '@/components/common/BooleanIcon'
import { useRouter } from 'next/router'
import { activeFilters, BotSearchQuery, GenderEnum, genderFilters, inUseFilters, PlatformEnum, platformFilters } from '@/models/bots'
import Link from 'next/link'
import { SizeType } from 'antd/lib/config-provider/SizeContext'

const { Option } = Select

type BotsTableProps = {
  onLoadBots: Function
}

const tableSizes = [
  {value: "small", label: "small"},
  {value: "middle", label: "middle"},
  {value: "large", label: "large"},
]

const BotsTable = observer(({onLoadBots}: BotsTableProps) => {
  const botStore = useContext(BotContext);

  const router = useRouter()

  console.log('bots are', botStore.bots)
  const botQuery = botStore?.botSearchQuery
  const currentPage = botStore?.currentPage
  const total = botStore?.botSearch?.total
  const bots = botStore?.botSearch?.bots

  const [tableSize, setTableSize] = useState(tableSizes[0].value)

  // states
  //
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
        onClick={() =>  {
          botStore.botSearchQuery = new BotSearchQuery()
          botStore.getBotsApi(true)
        }}
      >
        Reset filters
      </Button>
      <div className="flex gap-5 mt-2">
        {/* PLATFORM FILTER */}
        <div>
          <div>Platform filter</div>
          <Radio.Group
            value={botQuery.platform}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => {
              console.log(`value is ${e.target.value}`)
              botQuery.platform = e.target.value
              console.log(`bot query platform is ${botQuery.platform}`)
              onLoadBots(true)
            }}
          >
            {platformFilters.map((item,index) =>
              <Radio.Button 
                key={index}
                value={item.query_value}
              >
                { item.label }
              </Radio.Button>
            )}
          </Radio.Group>
        </div>
        {/* GENDER FILTER */}
        <div>
          <div>Gender filter</div>
          <Radio.Group
            value={botQuery.gender}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => {
              botQuery.gender = e.target.value
              onLoadBots(true)
            }}
          >
              {genderFilters.map((item,index) =>
                <Radio.Button 
                  key={index}
                  value={item.query_value}
                >
                  { item.label }
                </Radio.Button>
              )}
          </Radio.Group>
        </div>
      </div>

      <div className="flex gap-5 mt-3">
        {/* ACTIVE FILTER */}
        <div>
          <div>Active filter</div>
          <Select
            className="w-32"
            value={botQuery.is_active}
            onChange={(value: any, option) => {
              botQuery.is_active = value
              onLoadBots(true)
            }}
          >
            {activeFilters.map((filter,index) =>
              <Option value={filter.query_value} key={index}>
                { filter.label }
              </Option>
            )}
          </Select>
        </div>

        {/* IS IN USE FILTER */}
        <div>
          <div>In use filter</div>
          <Select
            className="w-32"
            value={botQuery.is_in_use}
            onChange={(value: any, option) => {
              console.log('value is', value)
              console.log('value is und', value == undefined)
              console.log('option is', option)
              botQuery.is_in_use = value
              onLoadBots(true)
            }}
          >
            {inUseFilters.map((filter, index) =>
              <Option value={filter.query_value} key={index}>
                { filter.label }
              </Option>
            )}
          </Select>
        </div>
      </div>

      {/* TABLE SIZE */}
      <div className="mt-2">
        <div>Table size</div>
        <Radio.Group
          options={tableSizes}
          value={tableSize}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            setTableSize(e.target.value)
          }}
        />
      </div>

      <Table
        className="mt-3"
        dataSource={bots}
        size={tableSize as SizeType}
        rowKey="id"
        loading={botStore.botsLoading}
        pagination={{
          total: total,
          pageSize: botQuery.limit,
          current: currentPage,
          size: "default",
          onChange: ((page: number) => {
            botStore.setCurrentPage(page)
            botQuery.offset = (page-1) * (bots?.length || 10)
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
                { new Date(created_time).toUTCString() }
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
                { platform }
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
                { gender || '---' }
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
        {/* IS IN USE*/}
        <Column
          title="In use"
          dataIndex="is_in_use"
          key="is_in_use"
          render={(is_in_use: boolean) => (
            <div className="cursor-pointer">
              <BooleanIcon 
                value={is_in_use}
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
        type="primary"
        shape="round"
        onClick={() => router.push('bots/new')}
      >
        Add new bot
      </Button>
        <div className="mt-3">
          <BotsTable 
            onLoadBots={async() => {
              botStore.getBotsApi(true)
            }}
          />
        </div>
    </main>
  )
});

export default Bots
