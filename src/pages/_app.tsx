import '../styles/globals.css'
import 'antd/dist/antd.css'

import type { AppProps } from 'next/app'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/store/appStore';
import { UserContext } from '@/store/userStore';
import Login from './login';
import NavSidebar from '@/components/NavSidebar';
import { Layout } from 'antd';

const { Content } = Layout

function MyApp({ Component, pageProps }: AppProps) {
	const appStore = useContext(AppContext)
	const userStore = useContext(UserContext) 

	const [initialDataLoading, setInitialDataLoading] = useState(true);

	useEffect(() => {
		const loadInitialData = async () => {
			await appStore.getCommonInfo();
			await userStore.checkUserAuthorized();
			setInitialDataLoading(false)
		}
		loadInitialData();
	}, [])

	if (!initialDataLoading) {
		return(
      <>
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
      </>
		)
	} else {
		return <div>Loading...</div>
	}

}

export default MyApp
