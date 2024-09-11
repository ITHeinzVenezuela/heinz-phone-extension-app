import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import Input from '../widgets/Input'
import ExtensionService from '@/services/extensions'
import EmployeesService from '@/services/employees'
import Spinner from '../widgets/Spinner'
import { Employee } from '@/pages/api/_schemas/employee.schema'

type Props = {
  id: string,
  number: number | undefined,
  employee: Employee,
  setNumber: Dispatch<SetStateAction<number | undefined>>,
  handleChange: (setNumber: Dispatch<SetStateAction<number | undefined>>, { target }: ChangeEvent<HTMLInputElement>) => void
}

const ExtensionInput = ({ id, number, employee, setNumber, handleChange }: Props) => {

  const [warningMessage, setWarningMessage] = useState<string>("")

  const [loading, setLoading] = useState<boolean>(false)

  const handleBlur = async () => {
    try {
      const employeeService = new EmployeesService()
      const extensionService = new ExtensionService()
      if (number) {
        setWarningMessage("")
        setLoading(true)
        const isAsigned = await extensionService.findOne(number)

        if (isAsigned) {
          if(isAsigned.ficha !== employee.ficha){
            const employee = await employeeService.findOne(isAsigned.ficha)
            setWarningMessage(`❗Esta extensión ya está asignada a ${employee.name}, ${employee.ficha}`)
          }
        } else {
          setWarningMessage("✅Extensión sin asignar")
        }

        setLoading(false)

      } else {
        setWarningMessage("")
      }
    } catch (error) {
      setLoading(false)
      console.log('error', error)
      alert("Ha habido un error comprobando la extensión")
    }
  }

  return (
    <div>
      <Input
        id={id}
        value={number}
        minLength={4}
        className="w-full"
        // title="N° de Extensión"
        placeholder="0000"
        onBlur={handleBlur}
        onChange={(event) => handleChange(setNumber, event)}
        required={false}
      />
      <div className="text-start">
        {
          loading ?
          <div className="pt-2">
            <Spinner size="small" text justify={false} />
          </div>
            :
            <>
              {
                warningMessage &&
                <span className="block text-slate-400 pt-2">{warningMessage}</span>
              }
            </>
        }
      </div>
    </div>
  )
}

export default ExtensionInput