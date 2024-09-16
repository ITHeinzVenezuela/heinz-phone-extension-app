import React, { Dispatch, SetStateAction, useState } from 'react'
import { FaPowerOff } from 'react-icons/fa6'
import Button from '../widgets/Button'
import { Department } from '@/pages/api/_schemas/department.schema'
import DepartmentService from '@/services/departments'
import ConfirmModal from '../widgets/ConfirmModal'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '../widgets/NotificationModal'
import Spinner from '../widgets/Spinner'

type Props = {
  department: Department,
  employees: number,
  asignedExtensions: number,
  setDepartments: Dispatch<SetStateAction<Department[]>>
}

const departmentService = new DepartmentService()

const DepartmentRow = ({ department, employees, asignedExtensions, setDepartments }: Props) => {

  const [status, handleStatus] = useNotification()
  const [confirm, handleConfirm] = useNotification()

  const { id, name } = department

  const updateStatus = !department.active

  const [loading, setLoading] = useState<boolean>(false)

  const handleActivate = {
    button: () => {
      handleConfirm.open({
        type: "warning",
        title: "Advertencia",
        message: `¿Estás seguro que quieres ${updateStatus ? '"Activar"' : '"Desactivar"'} el departamento "${name}"-("${id}")?`
      })
    },
    confirm: async () => {
      try {
        setLoading(true)

        const method = updateStatus ? "activate" : "desactivate"

        await departmentService[method](department.id)

        const departments = await departmentService.getAll()
        setDepartments(departments)

        handleStatus.open(({
          type: "success",
          title: `${updateStatus ? "Activación" : "Desactivación"} de Departamento`,
          message: `Se ha ${updateStatus ? "activado" : "desactivado"} el empleado exitosamente"`,
        }))

        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log(error)
        handleStatus.open(({
          type: "danger",
          title: "Error ❌",
          message: `Ha habido un error tratando de crear el empleado, intente de nuevo."`,
        }))
      }
    }
  }
  
  return (
    <tr className={`${employees === 0 && "bg-slate-200"}`}>
      <td className="!p-1">{id}</td>
      <td className="!p-1">{name}</td>
      <td className="!p-1 text-center">{employees}</td>
      <td className="!p-1 text-center">{asignedExtensions}</td>
      <td className="!p-1">
        <Button
          onClick={handleActivate.button}
          color={department.active ? "success" : "gray"}
        >
          <FaPowerOff />
        </Button>
      </td>
      <ConfirmModal
        acceptAction={handleActivate.confirm}
        confirmProps={[confirm, handleConfirm]}
      />
      <NotificationModal alertProps={[status, handleStatus]} />
      {
        loading &&
        <div className="overlay">
          <Spinner size="normal" text />
        </div>
      }
    </tr>
  )
}

export default DepartmentRow