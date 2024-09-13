import React, { ChangeEvent, ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react'
import Modal from '../widgets/Modal'
import { EmployeeExtension, Extension } from '@/pages/api/_schemas/extension.schema'
import Input from '../widgets/Input'
import Button from '../widgets/Button'
import ExtensionService from '@/services/extensions'
import ExtensionInput from './ExtensionInput'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '../widgets/NotificationModal'

type Props = {
  extension: EmployeeExtension,
  searchExtensions: () => Promise<void>,
  handleModal: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ]
}

const ModifyModal = ({ extension, handleModal, searchExtensions }: Props) => {

  const [showModal, setModal] = handleModal

  const [status, handleStatus] = useNotification()
  
  const { department, employee } = extension

  const [loading, setLoading] = useState<boolean>(false)
  // const [number, setNumber] = useState<number[] | undefined>(extension.number)

  const default1 = extension.number ? extension.number[0] : undefined
  const default2 = extension.number ? extension.number[1] : undefined

  const [number1, setNumber1] = useState<number | undefined>(default1)
  const [number2, setNumber2] = useState<number | undefined>(default2)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const extensionService = new ExtensionService()
      
      const asignExtension = async (number: number | undefined, defaultNumber: number | undefined) => {
        if (number) {
          const extensionInfo: Extension = {
            number,
            departmentId: department.id,
            ficha: employee.ficha,
          }

          const isAsigned = await extensionService.findOne(number)

          if (isAsigned && isAsigned.ficha === employee.ficha) {

            await extensionService.update(number, extensionInfo)

          } else {
            debugger
            await extensionService.create(extensionInfo)
          }

          handleStatus.open(({
            type: "success",
            title: "Asignación de Extensión",
            message: `Se ha asignado la extensión al trabajador exitosamente"`,
          }))
          
          
        } else {
          // debugger
          if (defaultNumber) {
            await extensionService.delete([defaultNumber], employee.ficha)
            handleStatus.open(({
              type: "success",
              title: "Eliminación de Extensión",
              message: `Se ha eliminado la extensión "${defaultNumber}" con éxito"`,
            }))
          }
        }
      }

      // if (number1) {
        await asignExtension(number1, default1)
      // }

      // if (number2) {
        await asignExtension(number2, default2)
      // }
      
      await searchExtensions()
      setModal(false)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      handleStatus.open(({
        type: "danger",
        title: "Error ❌",
        message: `Ha ocurrido un error asignandole la extensión al trabajador"`,
      }))
    }
  }

  const handleChange = (setNumber: Dispatch<SetStateAction<number | undefined>>, { target }: ChangeEvent<HTMLInputElement>) => {
    setNumber(target.value !== "" ? parseInt(target.value) : undefined)
  }

  return (
    <Modal {...{ showModal, setModal }} targetModal="SmallModal">
      <form onSubmit={handleSubmit}>
        <ul className="text-base pb-4">
          <li className="font-bold">{employee.name}</li>
          {/* <li>Cedula: {employee.cedula}</li> */}
          {/* <li>{employee.ficha}</li> */}
        </ul>
        <div className="grid gap-2">
          <ExtensionInput
            id="extension-1"
            number={number1}
            setNumber={setNumber1}
            employee={employee}
            handleChange={handleChange}
          />
          <ExtensionInput
            id="extension-2"
            number={number2}
            setNumber={setNumber2}
            employee={employee}
            handleChange={handleChange}
          />
        </div>
        <Button type="submit" color="info" className="w-full mt-4" loading={loading}>Asignar</Button>
      </form>
      <NotificationModal alertProps={[status, handleStatus]} />
    </Modal>
  )
}

export default ModifyModal