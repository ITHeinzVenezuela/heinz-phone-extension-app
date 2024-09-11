import { EmployeeExtension } from '@/pages/api/_schemas/extension.schema'
import React, { useState } from 'react'
import Button from '../widgets/Button'
import ModifyModal from './ModifyModal'

type Props = {
  isAdmin: boolean,
  extension: EmployeeExtension,
  searchExtensions: () => Promise<void>
}

const ExtensionRow = ({ extension, isAdmin, searchExtensions }: Props) => {

  const { employee, department } = extension
  const [showModifyModal, setModifyModal] = useState<boolean>(false)

  return (
    <tr>
      <td>{employee.ficha}</td>
      <td>{employee.name}</td>
      <td>{department.name}</td>
      <td>{extension.number ? extension.number.join(", ") : "-"}</td>
      {
        isAdmin &&
        <td>
          <div className="flex gap-2">
            <Button color="info" onClick={() => setModifyModal(true)}>Modificar</Button>
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
    </tr>
  )
}

export default ExtensionRow