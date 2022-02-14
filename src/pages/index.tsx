import { User } from '@/store/userStore'
import { observer } from 'mobx-react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { UserContext } from '@/store/userStore'
import { AppContext } from '@/store/appStore'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
	const router = useRouter()
	// stores
	const userStore = useContext(UserContext)

	if (!userStore.isUserAuthorized) {
		router.push("login")
	}

	if (userStore.isUserAuthorized) {
		return (
			<div className={styles.container}>
				<Head>
					<title>Create New App</title>
				</Head>

				<main>
					<h1 className="text-4xl">
						Welcome to the <a href="https://nextjs.org">Next.js!</a><br/>
					</h1>
				</main>

				<footer>
					footer is there
				</footer>
			</div>
		)
	}
	return (
		<div>
			loading...
		</div>
	)
}

export default Home
