import { getFromSStorage } from '@/utils/sessionStorage'
import React, { useEffect, useState } from 'react'
import { UserCredentials } from '../api/_schemas/user.schema'
import Header from '@/components/widgets/Header'
import { Department } from '../api/_schemas/department.schema'
import DepartmentService from '@/services/departments'
import Spinner from '@/components/widgets/Spinner'
import Button from '@/components/widgets/Button'
import { FaPowerOff } from "react-icons/fa6";
import ExtensionService from '@/services/extensions'
import { EmployeeExtension } from '../api/_schemas/extension.schema'
import EmployeesService from '@/services/employees'
import { Employee } from '../api/_schemas/employee.schema'
import { TbPhoneX } from "react-icons/tb";
import { TbPhoneCheck } from "react-icons/tb";

const extensionService = new ExtensionService()
const employeeService = new EmployeesService()
const departmentService = new DepartmentService()

const Departamentos = () => {

  const [user, setUser] = useState<UserCredentials>({
    name: "",
    email: "",
  })

  const [extensions, setExtensions] = useState<EmployeeExtension[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [noExtensionVisible, setNoExtensionVisible] = useState<boolean>(false)
  
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

        const employees = await employeeService.getAll()
        setEmployees(employees)

        const departments = await departmentService.getAll()
        setDepartments(departments)

        setLoading(false)

        await searchExtensions()

      } catch (error) {
        setLoading(false)
        console.log('error', error);
      }
    })()
  }, [])

  const searchExtensions = async () => {
    try {
      const extensions = await extensionService.getAllInfo("all")
      setExtensions(extensions)
    } catch (error) {
      console.log('error', error)
      alert("Ha ocurrido un error tratando de actualizar el listado de extensiones")
    }
  }

  return (
    <>
      <Header {...{ user, isAdmin, setIsAdmin }} />
      <main className="p-4">
        <h1>Departamentos:</h1>
        <div>
        <Button
          color={noExtensionVisible ? "gray" : "success"}
          className="w-[50px] h-[50px] flex justify-center items-center"
          onClick={() => { setNoExtensionVisible(!noExtensionVisible) }}
        >
          {
            noExtensionVisible ? <TbPhoneX size={20} /> : <TbPhoneCheck size={20} />
          }
        </Button>
        </div>
        {
          !loading ?
            <table>
              <thead>
                <tr>
                  <th className="!px-1">ID</th>
                  <th className="!px-1">Nombre</th>
                  <th className="!px-1 text-center">Empleados</th>
                  <th className="!px-1 text-center">Extensiones Asignadas</th>
                  <th className="!px-1">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  departments.map(({ id, name }) => {

                    const data = employees.filter(({ departmentId }) => departmentId === id)
                    const dataExtensions = extensions.filter(({ department }) => department.id === id)
                    const asignedExtensions = [...new Set(dataExtensions.map(({ number }) => number).flat())].length
                    
                    // data.map(({ficha})=>{
                    //   const e = extensions.find(({employee})=> employee.ficha === ficha)
                    // })
                    
                    // Boolean(data.length) && !noExtensionVisible &&
                    return (
                      noExtensionVisible ? 
                        data.length !== 0 &&
                        <tr>
                          <td className="!p-1">{id}</td>
                          <td className="!p-1">{name}</td>
                          <td className="!p-1 text-center">{data.length}</td>
                          <td className="!p-1 text-center">{asignedExtensions}</td>
                          <td className="!p-1">
                            <Button color="success" onClick={() => { }}>
                              <FaPowerOff />
                            </Button>
                          </td>
                        </tr>
                        :
                      <tr>
                        <td className="!p-1">{id}</td>
                        <td className="!p-1">{name}</td>
                        <td className="!p-1 text-center">{data.length}</td>
                        <td className="!p-1 text-center">{asignedExtensions}</td>
                        <td className="!p-1">
                          <Button color="success" onClick={() => { }}>
                            <FaPowerOff />
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            :
            <div className="py-40 flex justify-center items-center gap-4">
              <Spinner size="normal" /> <span className="text-lg font-semibold">Cargando...</span>
            </div>
        }
      </main>
    </>
  )
}

export default Departamentos