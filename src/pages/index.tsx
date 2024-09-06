import ExtensionService from '@/services/extensions'
import React, { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react'
import { EmployeeExtension, Extension } from './api/_schemas/extension.schema'
import { Employee } from './api/_schemas/employee.schema'
import EmployeesService from '@/services/employees'
import { Department } from './api/_schemas/department.schema'
import DeparmentService from '@/services/departments'
import ExtensionRow from '@/components/pages/ExtensionRow'
import Button from '@/components/widgets/Button'
import Input from '@/components/widgets/Input'
import { TbPhoneX } from "react-icons/tb";
import { TbPhoneCheck } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";

import Spinner from '@/components/widgets/Spinner'
import ModifyModal from '@/components/pages/ModifyModal'
import { sortDepartments } from '@/utils'
import { useRouter } from 'next/router'
import { getFromSStorage } from '@/utils/sessionStorage'
import { UserCredentials } from './api/_schemas/user.schema'

const extension = new ExtensionService()
const department = new DeparmentService()

const Home = () => {

  const router = useRouter()

  const [user, setUser] = useState<UserCredentials>({
    name: "",
    email: "",
  })

  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [extensions, setExtensions] = useState<EmployeeExtension[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [noExtensionVisible, setNoExtensionVisible] = useState<boolean>(false)

  const [selectedDepartment, setSelectedDepartment] = useState<string>("")

  useEffect(() => {
    const user = getFromSStorage<UserCredentials>("user")
    if (user) {
      setUser(user)
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        await searchExtensions()

        const departments = await department.getAll()
        setDepartments(departments)

        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log('error', error);
      }
    })()
  }, [])

  const searchExtensions = async () => {
    const extensions = await extension.getAllInfo(selectedDepartment)
    setExtensions(extensions)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      await searchExtensions()

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log('error', error)
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = ({ target }) => {
    const { name, value } = target
    if (name === "department") {
      setSelectedDepartment(value)
    }
  }

  const asignedExtensions = extensions.filter(({ number }) => number?.length)

  const data = noExtensionVisible ? extensions : asignedExtensions

  return (
    <main>
      <section className="p-4">
        <div className="flex justify-between pb-4">
          <form className="flex gap-4" onSubmit={handleSubmit}>
            <label htmlFor="" className="Input">
              <select className="Input" name="department" id="" onChange={handleChange}>
                <option value="">TODOS</option>
                {
                  sortDepartments(departments).map(({ id, name }) =>
                    <option value={id}>{name}</option>
                  )
                }
              </select>
            </label>

            {/* <Input
              id="name"
              // value={name}
              className="w-full"
              // title="Nombre del Chofer"
              placeholder="ORLANDO MENDOZA"
            // onChange={handleChange}
            /> */}
            <Button type="submit" color="secondary">Buscar</Button>

            <Button
              color={noExtensionVisible ? "gray" : "success"}
              className="w-[50px] h-[50px] flex justify-center items-center"
              onClick={() => { setNoExtensionVisible(!noExtensionVisible) }}
            >
              {
                noExtensionVisible ? <TbPhoneX size={20} /> : <TbPhoneCheck size={20} />
              }
            </Button>

          </form>
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
        </div>
        {
          !loading ?
            <table>
              <thead>
                <tr>
                  <th>Ficha</th>
                  <th>Nombre</th>
                  <th>Departamento</th>
                  <th>Extensión</th>
                  {
                    isAdmin &&
                    <th>Acciones</th>
                  }
                </tr>
              </thead>
              <tbody>
                {
                  data.map((extension) =>
                    <ExtensionRow {...{ extension, isAdmin, searchExtensions }} />
                  )
                }
              </tbody>
            </table>
            :
            <div className="py-40 flex justify-center items-center gap-4">
              <Spinner size="normal" /> <span className="text-lg font-semibold">Cargando...</span>
            </div>
        }
      </section>
    </main>
  )
}

export default Home;