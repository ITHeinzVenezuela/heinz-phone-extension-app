import { getFromSStorage } from '@/utils/sessionStorage'
import React, { useEffect, useState } from 'react'
import { UserCredentials } from '../api/_schemas/user.schema'
import Header from '@/components/widgets/Header'

const Departamentos = () => {
  
  const [user, setUser] = useState<UserCredentials>({
    name: "",
    email: "",
  })

  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  
  useEffect(() => {
    const user = getFromSStorage<UserCredentials>("user")
    if (user) {
      setUser(user)
      setIsAdmin(true)
    }
  }, [])
  
  return (
    <>
      <Header {...{ user, isAdmin, setIsAdmin }} />
      <main>Departamentos</main>
    </>
  )
}

export default Departamentos