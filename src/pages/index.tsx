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

const extensionService = new ExtensionService()
const departmentService = new DepartmentService()

const Home = () => {

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [rendered, setRendered] = useState<boolean>(false)

  const [user, setUser] = useState<UserCredentials>({
    name: "",
    email: "",
  })

  const [modifyEmployee, setModifyEmployee] = useState<Employee | undefined>(undefined)

  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [extensions, setExtensions] = useState<EmployeeExtension[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [noExtensionVisible, setNoExtensionVisible] = useState<boolean>(false)

  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

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

        const departments = await departmentService.getAll()
        setDepartments(departments)

        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log('error', error);
      }
    })()
  }, [])

  const searchExtensions = async () => {
    try {
      const extensions = await extensionService.getAllInfo(selectedDepartment)
      setExtensions(extensions)
    } catch (error) {
      console.log('error', error)
      alert("Ha ocurrido un error tratando de actualizar el listado de extensiones")
    }
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
    <>
      <Header {...{ user, isAdmin, setIsAdmin }} />
      <main>
        <section className="p-4">
          <div className="flex justify-between items-center pb-4">
            <form className="flex gap-4" onSubmit={handleSubmit}>
              <label htmlFor="" className="Input">
                <select className="Input" name="department" id="" onChange={handleChange}>
                  <option value="all">TODOS</option>
                  {
                    departments.map(({ id, name }) =>
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
                Descargar Listado <IoMdCloudDownload size={20}/>
              </Button>
              {
                isAdmin &&
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
                      isAdmin &&
                      <th>Acciones</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    data.map((extension) =>
                      <ExtensionRow {...{
                        extension,
                        isAdmin,
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
      </main>
    </>
  )
}

export default Home;