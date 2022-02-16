import { observer } from 'mobx-react'
import type { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { AppContext } from '@/store/appStore'

const Bots: NextPage = () => {
  return (
		<div>
			<h1>
        bots page is here
			</h1>
		</div>
  )
}

export default Bots
