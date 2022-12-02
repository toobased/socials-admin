import '../styles/globals.css'
import 'antd/dist/antd.css'

import type { AppProps } from 'next/app'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/store/appStore';
import { UserContext } from '@/store/userStore';
// import Login from './login';
// import NavSidebar from '@/components/NavSidebar';
// import { Layout } from 'antd';
import { ChakraProvider } from '@chakra-ui/react';

// import { BotTasksContext } from '@/store/botsTasksStore';
import HeadingNav from '@/components/common/HeadingNav';
import LoadingContainer from '@/components/common/LoadingContainer';
import { AddSourceModal } from '@/components/social_source/AddSourceModal';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { CreateBotModal } from '@/components/bots/CreateBotModal';
import chakraTheme from '@/styles/theme';
import { BotTasksContext } from '@/store/botsTasksStore';
import { EditBotModal } from '@/components/bots/EditBotModal';

function MyApp({ Component, pageProps }: AppProps) {
  const appStore = useContext(AppContext)
  const userStore = useContext(UserContext)
    const tasksStore = useContext(BotTasksContext)

  const [initialDataLoading, setInitialDataLoading] = useState(true);

  useEffect(() => {
    console.log('process env is', process.env)
    appStore.prefs.init()
    const loadInitialData = async () => {
        await tasksStore.getTasksTypes()
      // await appStore.getCommonInfo();
      // await userStore.checkUserAuthorized();
      setInitialDataLoading(false)
    }
    loadInitialData();
  }, [])

  if (initialDataLoading) {
    return <LoadingContainer />
  }

  return(
    <>
      <ChakraProvider theme={chakraTheme}>
      { userStore.isUserAuthorized || true &&
         <div>
          <HeadingNav />
          <Component {...pageProps} />
        </div>
      }
      {/*
      { !userStore.isUserAuthorized &&
        <Login {...pageProps}/>
      }
      */}

      <AddSourceModal />
      <CreateTaskModal />
      <CreateBotModal />
      <EditBotModal />

      </ChakraProvider>
    </>
  )

}

export default MyApp
