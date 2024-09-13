import React from 'react'
import { FaPowerOff } from 'react-icons/fa6'
import Button from '../widgets/Button'
import { Department } from '@/pages/api/_schemas/department.schema'

type Props = {
  department: Department,
  employees: number,
  asignedExtensions: number,
}

const DepartmentRow = ({ department,  employees, asignedExtensions}: Props) => {

  const { id, name } = department
  return (
    <tr className={`${employees === 0 && "bg-slate-200"}`}>
      <td className="!p-1">{id}</td>
      <td className="!p-1">{name}</td>
      <td className="!p-1 text-center">{employees}</td>
      <td className="!p-1 text-center">{asignedExtensions}</td>
      <td className="!p-1">
        <Button color="success" onClick={() => { }}>
          <FaPowerOff />
        </Button>
      </td>
    </tr>
  )
}

export default DepartmentRow