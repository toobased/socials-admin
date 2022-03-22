import '../styles/globals.css'
import 'antd/dist/antd.css'

import type { AppProps } from 'next/app'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/store/appStore';
import { UserContext } from '@/store/userStore';
import Login from './login';
import NavSidebar from '@/components/NavSidebar';
import { Layout } from 'antd';
import { ChakraProvider, Theme } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { ButtonTheme } from '@/styles/chakraButtonTheme';
import { BotTasksContext } from '@/store/botsTasksStore';

const colors = {
  error: 'red.500',
  success: 'green.500',
  primary: {
    default: 'red.500',
    _dark: 'red.500'
  },
}
const chakraTheme = extendTheme({
  // colors: colors,
  components: {
    Button: ButtonTheme
  }
})

const { Content } = Layout

function MyApp({ Component, pageProps }: AppProps) {
  const appStore = useContext(AppContext)
  const userStore = useContext(UserContext) 
  const tasksStore = useContext(BotTasksContext)

  const [initialDataLoading, setInitialDataLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      await appStore.getCommonInfo();
      await userStore.checkUserAuthorized();
      await tasksStore.getTasksTypes();
      setInitialDataLoading(false)
    }
    loadInitialData();
  }, [])

  if (!initialDataLoading) {
    return(
      <>
        <ChakraProvider theme={chakraTheme}>
        { userStore.isUserAuthorized &&
            <Layout
              hasSider={true}
            >
              <NavSidebar />
              <Layout>
                <Content>
                  <Component {...pageProps} />
                </Content>
              </Layout>
            </Layout>
        }
        { !userStore.isUserAuthorized &&
          <Login {...pageProps}/>
        }
        </ChakraProvider>
      </>
    )
  } else {
    return <div>Loading...</div>
  }

}

export default MyApp
