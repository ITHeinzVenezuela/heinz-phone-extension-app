import Button from '@/components/widgets/Button'
import Form from '@/components/widgets/Form'
import Input from '@/components/widgets/Input'
import NotificationModal from '@/components/widgets/NotificationModal'
import Spinner from '@/components/widgets/Spinner'
import useAuth from '@/hooks/useAuth'
import useNotification from '@/hooks/useNotification'
import UserService from '@/services/users'
import { saveToSStorage } from '@/utils/sessionStorage'
import { useRouter } from 'next/router'
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { TbLogin2 } from 'react-icons/tb'

const userService = new UserService()

const LogIn = () => {

  const [renderPage] = useAuth()
  const router = useRouter()

  const [user, setUser] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [logged, setlogged] = useState<boolean>(false)

  const [status, handleStatus] = useNotification()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      
      const userInfo = await userService.findOne(user.email)
      console.log('userInfo', userInfo)

      if (user.password === userInfo.password) {
        
        const {id, password, ...user} = userInfo
        saveToSStorage("user", user)
        
        handleStatus.open(({
          type: "success",
          title: "Inicio de Sesión",
          message: `Has iniciado sesión exitosamente"`,
        }))
        
        setlogged(true)
        
        setTimeout(() => {
          router.push("/")
        }, 2000);
      }
      
      setLoading(false)
      
    } catch (error) {
      setLoading(false)
      console.log(error);
      handleStatus.open(({
        type: "danger",
        title: "Inicio de Sesión inválido❗",
        message: `No se encontró registrado el usuario "${email}"`
      }))
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target
    setUser({
      ...user,
      [name]: value,
    })
  }

  const { email, password } = user

  return (
    <main className={`LoginForm`}>

      <img className="justify-self-center" width={150} src="https://i.imgur.com/yoGBPON.png" alt="" />

      {/* <UnauthenticatedTemplate> */}
      {
        !logged ?
          <Form onSubmit={handleSubmit}>
            <h1>Sistema de gestión de extensiones:</h1>

            <Input
              id="email"
              type="email"
              value={email}
              className="w-full"
              placeholder="Correo Electrónico"
              onChange={handleChange}
            />

            <Input
              id="password"
              type="password"
              value={password}
              className="w-full"
              placeholder="Contraseña"
              onChange={handleChange}
            />

            <Button type="submit" color="secondary" loading={loading}>
              Iniciar Sesión <TbLogin2 size={20} />
            </Button>

          </Form>
          :
          <div className="p-10">
            <Spinner size="small" />
          </div>
      }

      <NotificationModal alertProps={[status, handleStatus]} />
    </main>
  )
}

export default LogIn