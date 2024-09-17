import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from './Button'
import { FiLogIn } from 'react-icons/fi'
import { FaArrowUp } from "react-icons/fa";
import useAuth from '@/hooks/useAuth'

const Header = ({ }) => {

  const [renderPage, user, setUser] = useAuth()

  const router = useRouter()
  const $backToTopBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const $html = document.querySelector("html") as HTMLHtmlElement
      if ($html.scrollTop !== 0) {
        $backToTopBtn.current?.classList.remove("hidden")
      } else {
        console.log("hola")
        $backToTopBtn.current?.classList.add("hidden")
      }
    })
  }, [])

  return (
    <header className="bg-slate-200 p-4">
      <nav className="flex gap-2 items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link href="/">
            <img src="https://i.imgur.com/yoGBPON.png" className="h-[50px] w-[unset]" alt="" />
          </Link>
          {
            user &&
            <ul className="flex gap-4 items-center">
              <li className="block py-1 px-2 hover:bg-blue-500 hover:font-medium hover:text-white rounded-xl">
                <Link href="/departamentos">Departamentos</Link>
              </li>
            </ul>
          }
        </div>
        <div className="flex gap-2 items-center">
          {
            !user ?
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
                    setUser(null)
                  }}
                  className="flex gap-2 justify-center items-center !text-sm !rounded-3xl !px-3"
                >
                  Cerrar Sesión <FiLogIn size={20} />
                </Button>
              </>
          }
        </div>
        <button
          ref={$backToTopBtn}
          className="hidden fixed z-10 bottom-5 right-5 rounded-full p-2 bg-secondary"
          onClick={() => {
            const $html = document.querySelector("html") as HTMLHtmlElement
            $html.scrollTop = 0
          }}
        >
          <FaArrowUp className="fill-white" />
        </button>
      </nav>
    </header>
  )
}

export default Header