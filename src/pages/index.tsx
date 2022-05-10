// import { User } from '@/store/userStore'
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
	// stores
	// const userStore = useContext(UserContext)

  return (
    <div>
        home page here
    </div>
  )
}

export default Home
