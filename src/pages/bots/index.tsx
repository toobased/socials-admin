import { observer } from 'mobx-react'
import type { NextPage } from 'next'
import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { AppContext } from '@/store/appStore'
import { BotContext } from '@/store/botsStore'
import { Button, Table, Tooltip } from 'antd'
import Column from 'antd/lib/table/Column'
import { Icon } from '@iconify/react'
import CopyClipboardButton from '@/components/buttons/CopyClipboardButton'
import BooleanIcon from '@/components/common/BooleanIcon'
import { useRouter } from 'next/router'

const BotsTable = observer(() => {
  const botStore = useContext(BotContext);

  const router = useRouter()

  console.log('bots are', botStore.bots)
  const total = botStore?.botSearch?.total
  const bots = botStore?.botSearch?.bots

  return (
    <>
      { total }
      <Table
        onRow={(item,rowIndex) => {
          return {
            onClick: event => {
              router.push(`/bots/${item.id}`)
            }
          }
        }}
        dataSource={bots}
      >
        {/* USERNAME */}
        <Column
          title="Username"
          dataIndex="username"
          key="username"
          render={(username: string) => (
            <div className="cursor-pointer flex items-center">
              <div className="w-28 truncate">
                {username}
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
            <div className="cursor-pointer flex items-center">
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
  const botStore = useContext(BotContext);

  const loadInitialBots = async (replace: boolean = false) => {
    console.log('run load initial bots func')
    if (botStore?.botSearch?.bots && (!replace)) {
      return
    }
    if (!botStore.botsLoading) {
      await botStore.getBotsApi()
      console.log('finish to loading bots')
    }
  }

  loadInitialBots();
  // bots are { JSON.stringify(botStore.bots) }
  return (
    <main className="mx-11 my-7">
      <Button
        onClick={() => loadInitialBots(true)}
      >
        reload
      </Button>
      {botStore?.botSearch?.bots && !botStore.botsLoading &&
        <div className="">
          <BotsTable />
        </div>
      }
    </main>
  )
});

export default Bots
