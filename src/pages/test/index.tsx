import { observer } from 'mobx-react'
import type { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { AppContext } from '@/store/appStore'

const TestContainer = observer(() => {
	const app = useContext(AppContext)
	return (
		<div>
			<h1>
				test container
			</h1>
			<h2>
				{ app.commonInfo?.main_logo_link }
			</h2>
			<h1 className="text-red-500">
				app test field input below
			</h1>
			<input
				placeholder={"app test label"}
				value={app.testField}
				onChange={(e) => app.setTestField(e.target.value)}
			>
			</input>
		</div>
	)
})

const Test: NextPage = () => {
  return (
		<div>
			<h1>
				test page goes here
			</h1>
			<TestContainer />
		</div>
  )
}

export default Test
