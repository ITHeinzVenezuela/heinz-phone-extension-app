import { UserCredentials } from "@/pages/api/_schemas/user.schema"
import { getFromSStorage } from "@/utils/sessionStorage"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

const useAuth = (): [boolean, UserCredentials | null, Dispatch<SetStateAction<UserCredentials | null>>] => {

  const publicRoutes = ["/", "/login"]

  const router = useRouter()

  const [renderPage, setRenderPage] = useState<boolean>(false)

  const [user, setUser] = useState<UserCredentials | null>(null)

  useEffect(() => {
    // const credentials = getCookie<AuthCredentials>("login")
    const userFromSession = getFromSStorage<UserCredentials>("user")
    
    if(!user){
      if (userFromSession) {
  
        setUser(userFromSession)
        setRenderPage(true)
  
      } else if (!publicRoutes.includes(router.pathname)) {
        router.push("/")
      }
    }else if (router.pathname === "/login") {
      router.push("/")
    }
  }, [user])

  return [renderPage, user, setUser];
}

export default useAuth;