import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction } from 'react'
import Button from './Button'
import { FiLogIn } from 'react-icons/fi'
import { UserCredentials } from '@/pages/api/_schemas/user.schema'

type Props = {
  user: UserCredentials
  isAdmin: boolean,
  setIsAdmin: Dispatch<SetStateAction<boolean>>,
}

const Header = ({ user, isAdmin, setIsAdmin }: Props) => {

  const router = useRouter()

  return (
    <header className="bg-slate-200 p-4">
      <nav className="flex gap-2 items-center justify-between">
        <div className="flex gap-6 items-center">
          <img src="https://i.imgur.com/yoGBPON.png" className="h-[50px] w-[unset]" alt="" />
          {
            isAdmin &&
            <ul className="flex gap-4 items-center">
              <li>
                <Link href="/departamentos">Departamentos</Link>
              </li>
            </ul>
          }
        </div>
        <div className="flex gap-2 items-center">
          {
            !isAdmin ?
              <Button
                color="info"
                onClick={() => router.push("/login")}
                className="flex gap-2 justify-center items-center !text-sm !rounded-3xl !px-3"
              >
                Iniciar Sesión <FiLogIn size={20} />
              </Button>
              :
              <>
                <span>{user.name}</span>
                <Button
                  color="gray"
                  onClick={() => {
                    sessionStorage.clear()
                    setIsAdmin(false)
                  }}
                  className="flex gap-2 justify-center items-center !text-sm !rounded-3xl !px-3"
                >
                  Cerrar Sesión <FiLogIn size={20} />
                </Button>
              </>
          }
        </div>
      </nav>
    </header>
  )
}

export default Header