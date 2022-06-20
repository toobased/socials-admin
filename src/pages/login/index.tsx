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

const LoginForm: React.FC<{
  isLoading: boolean, 
  onUserLogin: Function
}> = 
  ({isLoading, onUserLogin}) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return(
    <div>
      <div className="flex flex-col max-w-max gap-1">
        <Input
          className="max-w-xs"
          // prefix={<Icon icon="ri:lock-password-line" />}
          placeholder="Логин"
          disabled={isLoading}
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          className="max-w-xs"
          // prefix={<Icon icon="ri:lock-password-line" />}
          placeholder="Пароль"
          disabled={isLoading}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          className="mt-1"
          disabled={isLoading}
          // type="primary"
          onClick={() => onUserLogin(username, password)}
        >
          Войти
        </Button>
      </div>
    </div>
  )
}

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
    <div className="flex flex-col items-center justify-center border-2 border-black h-full text-center">
      <Head>
        <title>Вход</title>
      </Head>

      <main>
        <Heading>
          Вход
        </Heading>

        <div className="mt-6">
          <LoginForm 
            isLoading={isLoading}
            onUserLogin={loginUser}
          />
        </div>
      </main>
    </div>
  )
}



export default Login
