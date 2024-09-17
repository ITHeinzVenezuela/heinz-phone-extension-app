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
import DepartmentRow from '@/components/pages/DepartmentRow'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '@/components/widgets/NotificationModal'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import useAuth from '@/hooks/useAuth'

const extensionService = new ExtensionService()
const employeeService = new EmployeesService()
const departmentService = new DepartmentService()

const Departamentos = () => {

  const [renderPage, user] = useAuth()
  
  const [status, handleStatus] = useNotification()
  const [extensions, setExtensions] = useState<EmployeeExtension[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [loading, setLoading] = useState<boolean>(false)

  const [noExtensionVisible, setNoExtensionVisible] = useState<boolean>(false)

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
      handleStatus.open(({
        type: "danger",
        title: "Error ❌",
        message: `Ha ocurrido un error tratando de actualizar el listado de extensiones"`,
      }))
    }
  }

  return (
    <>
      <Header />
      <main className="p-4">
        {/* <h1>Departamentos:</h1> */}
        <div className="flex justify-end">
          <Button
            color={noExtensionVisible ? "gray" : "success"}
            className="flex justify-center items-center gap-2"
            onClick={() => { setNoExtensionVisible(!noExtensionVisible) }}
          >
            <span>Ver Todos</span> {noExtensionVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
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
                  departments.map((department) => {

                    const { id, name } = department

                    const data = employees.filter(({ departmentId }) => departmentId === id)
                    const dataExtensions = extensions.filter(({ department }) => department.id === id)
                    const asignedExtensions = [...new Set(dataExtensions.map(({ number }) => number).flat())].length

                    // data.map(({ficha})=>{
                    //   const e = extensions.find(({employee})=> employee.ficha === ficha)
                    // })

                    // Boolean(data.length) && !noExtensionVisible &&
                    return (
                      noExtensionVisible ?
                        data.length !== 0 && (
                          <DepartmentRow {...{
                            department,
                            employees: data.length,
                            asignedExtensions,
                            setDepartments,
                          }} />
                        )
                        :
                        <DepartmentRow {...{
                          department,
                          employees: data.length,
                          asignedExtensions,
                          setDepartments,
                        }} />
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
        <NotificationModal alertProps={[status, handleStatus]} />
      </main>
    </>
  )
}

export default Departamentos