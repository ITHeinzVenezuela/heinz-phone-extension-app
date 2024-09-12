import { EmployeeExtension } from '@/pages/api/_schemas/extension.schema'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Button from '../widgets/Button'
import ModifyModal from './ModifyModal'
import { BsTelephonePlusFill } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Employee } from '@/pages/api/_schemas/employee.schema';
import EmployeesService from '@/services/employees';
import useNotification from '@/hooks/useNotification';
import ConfirmModal from '../widgets/ConfirmModal';
import ExtensionService from '@/services/extensions';

type Props = {
  isAdmin: boolean,
  extension: EmployeeExtension,
  searchExtensions: () => Promise<void>,
  setShowCreateModal: Dispatch<SetStateAction<boolean>>,
  setModifyEmployee: Dispatch<SetStateAction<Employee | undefined>>,
}

const employeeService = new EmployeesService()
const extensionService = new ExtensionService()

const ExtensionRow = ({ extension, isAdmin, searchExtensions, setModifyEmployee, setShowCreateModal }: Props) => {

  const { number, employee, department } = extension
  
  const [showModifyModal, setModifyModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  
  const [confirm, handleConfirm] = useNotification()

  const handleModifyContrator = () => {
    setModifyEmployee(employee)
    setShowCreateModal(true)
  }

  const handleDelete = {
    button: () => {
      handleConfirm.open({
        type: "warning",
        title: "Advertencia",
        message: `¿Estás seguro de que quieres eliminar el empleado "${employee.name}"?`
      })
    },
    confirm: async () => {
      try {
        setLoading(true)
        await employeeService.delete(employee.ficha)
        
        // Como puede tener varias extensiones al mismo tiempo, esto las elimina todas 
        // que estèn asociadas a ese empleado
        if (number) {
          await extensionService.delete(number, employee.ficha)
        }
        
        await searchExtensions()
        
        alert("Se ha eliminado el empleado y sus extensiones con exito")
        
        setLoading(false)
        
      } catch (error) {
        setLoading(false)
        console.log('error', error)
      }
    }
  }

  return (
    <tr>
      <td>{employee.ficha}</td>
      <td>
        <div className="flex justify-between items-center">
          {employee.name}
          {
            employee.contractor &&
            <span className="inline-block px-1 rounded-lg bg-emerald-400 text-white">
              Contractor
            </span>
          }
        </div>
      </td>
      <td>{department.name}</td>
      <td>{extension.number ? extension.number.join(", ") : "-"}</td>
      {
        isAdmin &&
        <td>
          <div className="flex gap-2">
            <Button color="info" onClick={() => setModifyModal(true)}>
              <BsTelephonePlusFill />
            </Button>
            {
              employee.contractor &&
              <Button color="success" onClick={handleModifyContrator}>
                <FaUserEdit />
              </Button>
            }
            {
              employee.contractor &&
              <Button color="danger" onClick={handleDelete.button}>
                <AiFillDelete />
              </Button>
            }
            {/* <Button color="danger">Eliminar</Button> */}
          </div>
        </td>
      }
      {
        showModifyModal &&
        <ModifyModal
          {...{ extension, searchExtensions }}
          handleModal={[showModifyModal, setModifyModal]}
        />
      }
      <ConfirmModal
        acceptAction={handleDelete.confirm}
        confirmProps={[confirm, handleConfirm]}
      />
    </tr>
  )
}

export default ExtensionRow