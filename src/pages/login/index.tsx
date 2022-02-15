import { Form, Input, Button } from 'antd'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'
import { UserContext } from '@/store/userStore'
// import Link from 'next/link'
import { useRouter } from 'next/router'
//



const Login: NextPage = () => {
  // router
  const router = useRouter()
	// stores
	const userStore = useContext(UserContext)
  // states
  const [isLoading, setIsLoading] = useState(false);
  // const [password, setPassword] = useState("");

  const loginUser = async (username: string, password: string) => {
    console.log('call user login', username, password)
    setIsLoading(true)
    const isSuccess: boolean = await userStore.loginUser(username, password)
    if (isSuccess) {
      router.push("/")
    }
    setIsLoading(false)
  }

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

      <LoginForm 
        isLoading={isLoading}
        onUserLogin={loginUser}
      />

      <footer>
				footer is there
      </footer>
    </div>
  )
}

const LoginForm: React.FC<{
  isLoading: boolean, 
  onUserLogin: Function
}> = 
  ({isLoading, onUserLogin}) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Form
        layout="inline"
      >
        <Form.Item
          name="username"
          rules={[
            {required: true, message: 'Username required'}
          ]}
        >
          <Input
            prefix={<Icon icon="ri:lock-password-line" />}
            placeholder="Username"
            disabled={isLoading}
            onChange={e => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {required: true, message: 'Password required'}
          ]}
        >
        <Input
          prefix={<Icon icon="ri:lock-password-line" />}
          placeholder="Password"
          disabled={isLoading}
          onChange={e => setPassword(e.target.value)}
        />
        </Form.Item>
      <Button
        disabled={isLoading}
        type="primary"
        onClick={() => onUserLogin(username, password)}
      >
        Log in
      </Button>
      </Form>
    </div>
  )
}

export default Login
