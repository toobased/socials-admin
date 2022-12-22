import { observer } from 'mobx-react'
import type { NextPage } from 'next'
import React, { useContext, useEffect } from 'react'
import { BotContext } from '@/store/botsStore'
import { Badge, Table as CTable, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { activeFilters, Bot, BotSearchQuery, genderFilters, IFilterValue, inUseFilters, platformFilters } from '@/models/bots'
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import ServerCallLabel from '@/components/common/ServerCallLabel'
import { errorMessageChakra, shortStr } from '@/utils'
import OptionDropdownFilter from '@/components/common/OptionDropdownFilter'
import { AppContext } from '@/store/appStore'
import SimpleTile from '@/components/common/SimpleTile'
import { Pagination } from 'antd'

type BotsTableProps = { onLoadBots: Function }

const TablePagination = observer(() => {
  const store = useContext(BotContext)
  const search = store.botSearch
  const query = store.botSearchQuery

  const totalItems = search.total
  const limit = query.limit
  // const skip = query.skip
  const currentPage = store.currentPage

  return (
    <div className="mt-3 width-full justify-end flex">
      <Pagination
        current={currentPage}
        pageSize={limit}
        total={totalItems}
        onChange={(p: number) => {
          console.log('run on change')
          store.currentPage = p
          query.skip =
            (store.currentPage-1) * limit
          store.getBotsApi(true)
        }}
      />
    </div>
  )
})

const BotsTableContent = observer(() => {
  const botStore = useContext(BotContext)
  const bots = botStore?.botSearch?.items
  const appStore = useContext(AppContext)

  const router = useRouter()

  const tableHeaderItems = [
    "Username", "Password", "Access token",
    "Дата создания", "Использовался", "Платформа", "Чил", "Чил по действиям", "Статус", "Действие"
  ]

    const handleEditBot = (_id: string, bot: Bot) => {
        botStore.setCurrentBotEdit(bot)
        appStore.modals.setEditBot(true)
    }


    // router.push(`bots/edit/${id}`)
    const handleGoEditPage = (id: string, bot: Bot) => {
        handleEditBot(id, bot)
    }

  const handleGoDetailPage = (id: string) => router.push(`bots/${id}`)

  const handleCheckBanned = async (id: string) => {
    const [isSuccess, msg] = await botStore.checkBannedApi(id)
    if (!isSuccess) {
      errorMessageChakra(msg)
      return
    }
    botStore.getBotsApi(true)
  }

  if (botStore.botsLoading) { return (<div>loading...</div>) }
  if (!bots) { return (<div>no bots</div>) }

  const BotActionsBlock = (p: { id: string, bot: Bot }) => {
    const { id, bot } = p
    return (
        <div>
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
            onClick={() => handleGoEditPage(id, bot)}
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
        <Button onClick={() => handleGoEditPage(id, bot) }>
            <div className="flex gap-3 items-center">
              <Icon
                icon="bxs:message-square-edit"
                width="25"
                className="block"
              />
            </div>
        </Button>
      </div>
    )
  }

  return (
    <div
      className="mt-4"
    >
      <CTable
        className="rounded-lg"
      >
        <Thead>
          <Tr>
            { tableHeaderItems.map((item, index) =>
              <Th key={index}>
                { item }
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {/* tasks */}
            {bots.map((v, i) =>
              <Tr
                key={i}
              >
                {/* username*/}
                <Td
                  onClick={() => handleGoDetailPage(v.id)}
                  className="font-semibold cursor-pointer">
                  { v.username }
                </Td>
                {/* eof usename */}

                {/* password */}
                <Td className="">
                    <SimpleTile value={shortStr(v.password)} useClipboard />
                </Td>
                {/* eof password */}

                {/* token */}
                <Td className="">
                    <SimpleTile value={shortStr(v.access_token || '')} useClipboard />
                </Td>
                {/* eof token */}

                {/* date created  */}
                <Td className="">
                    { v.date_created.normal }
                </Td>
                {/* eof date created */}

                {/* last used */}
                <Td className="">
                    { v.last_used?.elapsed_sweety(appStore.timestamp_now) || '---' }
                </Td>
                {/* eof last used */}

                {/* platform */}
                <Td className="">
                    { v.platform }
                </Td>
                {/* eof platform */}

                {/* chil */}
                <Td className="">
                    { v.rest_until?.cntdwn_sweety(appStore.timestamp_now) || '---' }
                </Td>
                {/* eof chil */}

                {/* chil actions */}
                <Td className="">
                    <div>Like: {v.actions_rest.like?.cntdwn_sweety(appStore.timestamp_now) || '---'}</div>
                    <div>Repost: {v.actions_rest.repost?.cntdwn_sweety(appStore.timestamp_now) || '---'}</div>
                    <div>Comment: {v.actions_rest.comment?.cntdwn_sweety(appStore.timestamp_now) || '---'}</div>
                </Td>
                {/* eof chil actions */}

                {/* active */}
                <Td className="items-center gap-2">
                    <Badge colorScheme={v.isError ? 'red' : 'default'} fontSize="lg">{ v.status }</Badge>
                    {/* launch btn */}
                    {v.isConfigure() &&
                        <Button onClick={async () => {
                            await v.makeReadyApi()
                            await botStore.getBotsApi(true)
                        }} size="md">🚀</Button>
                    }
                    {/* launch btn */}
                </Td>
                {/* eof active */}

                {/* bot action*/}
                <Td className="">
                    <BotActionsBlock id={v.id} bot={v} />
                </Td>
                {/* eof bot action */}
              </Tr>
            )}
          {/* eof bots */}
        </Tbody>
      </CTable>
    </div>
  )
})

const BotsTableFilters = observer((p: BotsTableProps) => {
    const { onLoadBots } = p

  const botStore = useContext(BotContext);
  const botQuery = botStore?.botSearchQuery
  // current filters
  const currentPlatformFilter = (): IFilterValue | undefined => platformFilters.filter((f) => f.query_value == botQuery.platform)[0] || undefined

  const currentGenderFilter = (): IFilterValue | undefined => genderFilters.filter((f) => f.query_value == botQuery.gender)[0] || undefined

  const currentActiveFilter = (): IFilterValue | undefined => activeFilters.filter((f) => f.query_value == botQuery.is_active)[0] || undefined

  const currentInUseFilter = (): IFilterValue | undefined => inUseFilters.filter((f) => f.query_value == botQuery.is_in_use)[0] || undefined
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
  </>
  )
})


const Bots: NextPage = observer(() => {
  // stores
    const appStore = useContext(AppContext)
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
    return (<> loading error? </>)
  }


  return (
    <main className="mx-11 my-7">
      {/* RELOAD BUTTON */}
      <Button
        variant="solid"
        onClick={() => appStore.modals.setCreateBot(true)}
      >
        Add new bot
      </Button>
      <div className="mt-3">
        <BotsTableFilters
          onLoadBots={async () => await botStore.getBotsApi(true)}
        />
      </div>
      <div className="mt-3">
        <BotsTableContent />
      </div>
      <div className="mt-3">
        <TablePagination />
      </div>
    </main>
  )
});

export default Bots
