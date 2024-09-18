import ExtensionService from '@/services/extensions'
import React, { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react'
import { EmployeeExtension, Extension } from './api/_schemas/extension.schema'
import { Department } from './api/_schemas/department.schema'
import DepartmentService from '@/services/departments'
import ExtensionRow from '@/components/pages/ExtensionRow'
import Button from '@/components/widgets/Button'
import { TbPhoneX } from "react-icons/tb";
import { TbPhoneCheck } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Spinner from '@/components/widgets/Spinner'
import { sortDepartments } from '@/utils'
import { useRouter } from 'next/router'
import { getFromSStorage } from '@/utils/sessionStorage'
import { UserCredentials } from './api/_schemas/user.schema'
import CreateEmployeeModal from '@/components/pages/CreateEmployeeModal'
import Header from '@/components/widgets/Header'
import { Employee } from './api/_schemas/employee.schema'
import { IoMdCloudDownload } from "react-icons/io";
import PDFRender from '@/components/widgets/PDFRenderer'
import NotificationModal from '@/components/widgets/NotificationModal'
import useNotification from '@/hooks/useNotification'
import useAuth from '@/hooks/useAuth'
import Input from '@/components/widgets/Input'

const extensionService = new ExtensionService()
const departmentService = new DepartmentService()

const Home = () => {

  const [renderPage, user, setUser] = useAuth()

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [rendered, setRendered] = useState<boolean>(false)

  const [searchedAll, setSearchedAll] = useState<string>("all")

  const [status, handleStatus] = useNotification()

  const [modifyEmployee, setModifyEmployee] = useState<Employee | undefined>(undefined)

  const [loading, setLoading] = useState<boolean>(false)

  const [extensions, setExtensions] = useState<EmployeeExtension[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [noExtensionVisible, setNoExtensionVisible] = useState<boolean>(false)

  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        await searchExtensions()

        const departments = await departmentService.getAll()
        setDepartments(departments)

        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log('error', error);
        handleStatus.open(({
          type: "danger",
          title: "Error ❌",
          message: `Ha ocurrido un error tratando de traerse la información de los departamentos"`,
        }))
      }
    })()
  }, [])

  const searchExtensions = async () => {
    try {
      setSearchedAll(selectedDepartment)
      const extensions = await extensionService.getAllInfo(selectedDepartment)
      setExtensions(extensions)
    } catch (error) {
      console.log('error', error)
      handleStatus.open(({
        type: "danger",
        title: "Error ❌",
        message: `Ha ocurrido un error tratando de actualizar el listado de extensiones"`,
      }))
    }
  }

  const handleSearchByDepartment: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)

    await searchExtensions()

    setLoading(false)
  }

  const handleSearchByName: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      const form = new FormData(event.currentTarget)
      const name = form.get("name") as string
      
      const extensions = await extensionService.findEmployee(name.toUpperCase())
      setExtensions(extensions)
      
      setSearchedAll("")
      setNoExtensionVisible(true)
      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log("error", error)
      handleStatus.open(({
        type: "danger",
        title: "Error ❌",
        message: `Ha ocurrido un error tratando de actualizar el listado de extensiones"`,
      }))
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

  const CI_MAX_LENGTH = 8

  return (
    <>
      <Header {...{ user, setUser }}/>
      <main>
        <section className="p-4">
          <div className="flex justify-between items-center pb-4">
            <div className="flex gap-4">
              <form className="flex" onSubmit={handleSearchByDepartment}>
                <label htmlFor="" className="Input !rounded-r-none !border-r-0">
                  <select className="Input" name="department" id="" onChange={handleChange}>
                    <option value="all">TODOS</option>
                    {
                      departments.map(({ id, name, active }) =>
                        active &&
                        <option value={id}>{name}</option>
                      )
                    }
                  </select>
                </label>

                <Button type="submit" color="secondary" className="!px-4 !rounded-l-none">
                  <FaSearch />
                </Button>

              </form>
              <form className="flex" onSubmit={handleSearchByName}>
                <Input
                  id="name"
                  className="w-full font-semibold !rounded-r-none !border-r-0"
                  maxLength={CI_MAX_LENGTH}
                  placeholder="Buscar por nombre"
                  onChange={handleChange}
                />
                <Button type="submit" color="secondary" className="!px-4 !rounded-l-none">
                  <FaSearch />
                </Button>
              </form>
              {
                searchedAll !== "all" &&
                <Button
                  color={noExtensionVisible ? "gray" : "success"}
                  title={`Visualizando empleados ${noExtensionVisible ? "sin" : "con"} extensiones asignadas`}
                  className="w-[50px] h-[50px] flex justify-center items-center"
                  onClick={() => { setNoExtensionVisible(!noExtensionVisible) }}
                >
                  {
                    noExtensionVisible ? <TbPhoneX size={20} /> : <TbPhoneCheck size={20} />
                  }
                </Button>
              }
            </div>
            <div className="flex gap-2">
              <Button
                className="flex gap-2 items-center !px-3 font-semibold bg-emerald-500"
                onClick={() => {
                  setRendered(true)
                  setTimeout(() => {
                    setRendered(false)
                  }, 3000)
                }}
              >
                Descargar Listado <IoMdCloudDownload size={20} />
              </Button>
              {
                user &&
                <Button
                  className="flex gap-2 items-center !px-3 font-semibold bg-sky-500"
                  onClick={() => {
                    setShowCreateModal(true)
                    setModifyEmployee(undefined)
                  }}
                >
                  Añadir Empleado <FaUserPlus />
                </Button>
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
                      user &&
                      <th>Acciones</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    data.map((extension) =>
                      <ExtensionRow {...{
                        user,
                        extension,
                        searchExtensions,
                        setShowCreateModal,
                        setModifyEmployee
                      }} />
                    )
                  }
                </tbody>
              </table>
              :
              <div className="py-40 flex justify-center items-center gap-4">
                <Spinner size="normal" /> <span className="text-lg font-semibold">Cargando...</span>
              </div>
          }
          {
            showCreateModal &&
            <CreateEmployeeModal
              modifyEmployee={modifyEmployee}
              departments={departments}
              searchExtensions={searchExtensions}
              showModal={showCreateModal}
              setModal={setShowCreateModal}
            />
          }
          {
            rendered &&
            <PDFRender departments={departments} extensions={data} />
          }
        </section>
        <NotificationModal alertProps={[status, handleStatus]} />
      </main>
    </>
  )
}

export default Home;