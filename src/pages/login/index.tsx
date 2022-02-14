import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '@/store/userStore'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
	const router = useRouter()
	// stores
	const userStore = useContext(UserContext)

  return (
    <div>
      <Head>
				<title>login page is here</title>
      </Head>

      <main>
        <h1 className="text-4xl">
					login page content
        </h1>
      </main>

      <footer>
				footer is there
      </footer>
    </div>
  )
}

export default Login
