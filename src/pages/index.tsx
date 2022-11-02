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
import { Heading } from '@chakra-ui/react'
import { isCurrentPage, MenuItem, menuItems } from '@/components/NavSidebar'
import { Icon } from '@iconify/react'
import ThemeSwitcher from '@/components/common/ThemeSwitcher'

export const MainMenuItemCard: React.FC<{
    item: MenuItem,
}> = ({item}) => {
    const router = useRouter()
    const isCurrent = isCurrentPage(item, router)
    return (
        <Link href={item.path} passHref>
            <div 
                className="py-4 px-6 cursor-pointer flex gap-2 items-center rounded-lg hover:opacity-60 select-none"
            >
                {item.icon &&
                    <Icon icon={item.icon} width="22px" height="100%"/>
                }
                <span className="text-lg">
                    { item.name }
                </span>
            </div>
        </Link>
    )
}

export const MainMenuItems = () => {
    return (
        <div className="flex border-t py-8 flex-wrap justify-center gap-4">
            {menuItems.map((item: MenuItem, index: number) =>
                <MainMenuItemCard
                    key={index}
                    item={item}
                />
            )}
        </div>
    )
}

const Home: NextPage = () => {
	// stores
	// const userStore = useContext(UserContext)

  return (
    <div className="max-w-screen-xl mx-auto">
        <Heading className="mb-2 text-center my-10 dark:text-white">
            Куда тебе нужно?
        </Heading>
        <MainMenuItems />
    </div>
  )
}

export default Home
