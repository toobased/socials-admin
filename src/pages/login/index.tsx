// import { Form, Input, Button } from 'antd'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'
import { UserContext } from '@/store/userStore'
// import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Heading, Input } from '@chakra-ui/react'
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
    console.log('success', isSuccess)
    if (isSuccess) {
      console.log('is success cond fired')
      setIsLoading(false)
      router.push("/")
    }
  }

  return (
    <div>
      <Head>
        <title>login page is here</title>
      </Head>

      <main>
        <Heading>
          login page content
        </Heading>
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
      <Input
        // prefix={<Icon icon="ri:lock-password-line" />}
        placeholder="Username"
        disabled={isLoading}
        onChange={e => setUsername(e.target.value)}
      />
      <Input
        // prefix={<Icon icon="ri:lock-password-line" />}
        placeholder="Password"
        disabled={isLoading}
        onChange={e => setPassword(e.target.value)}
      />
      <Button
        disabled={isLoading}
        // type="primary"
        onClick={() => onUserLogin(username, password)}
      >
        Log in
      </Button>
    </div>
  )
}

export default Login
