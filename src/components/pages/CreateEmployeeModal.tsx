import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react'
import Modal from '../widgets/Modal'
import { Employee } from '@/pages/api/_schemas/employee.schema'
import Input from '../widgets/Input'
import { Department } from '@/pages/api/_schemas/department.schema'
import Button from '../widgets/Button'
import { sortDepartments } from '@/utils'
import EmployeesService from '@/services/employees'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  searchExtensions: () => Promise<void>,
  departments: Department[],
}

const CreateEmployeeModal = ({ showModal, setModal, searchExtensions, departments }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)

  const [employee, setEmployee] = useState<Employee>({
    ficha: "",
    name: "",
    cedula: "",
    departmentId: "",
    contractor: true,
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      console.log('employee', employee)
      
      const employeeService = new EmployeesService()

      await employeeService.create(employee)
      
      alert("Se ha creado el empleado exitosamente")
      
      await searchExtensions()
      
      setModal(false)
      // setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = ({ target }) => {
    const { name, value } = target

    let employeeData = { ...employee }

    if (name === "ficha") {
      employeeData = {
        ...employeeData,
        cedula: value,
      }
    }

    setEmployee({
      ...employeeData,
      [name]: value,
    })
  }

  const CI_MAX_LENGTH = 8

  const { name, ficha } = employee

  return (
    <Modal {...{ showModal, setModal }} targetModal="SmallModal">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Input
          id="name"
          value={name}
          className="w-full font-semibold"
          title="Nombre"
          placeholder="Orlando Mendoza"
          onBlur={() => { }}
          onChange={handleChange}
        />
        <Input
          id="ficha"
          value={ficha}
          className="w-full font-semibold"
          title="Ficha"
          maxLength={CI_MAX_LENGTH}
          placeholder="000000000"
          onBlur={() => { }}
          onChange={handleChange}
        />
        <label htmlFor="" className="Input">
          <span className="font-semibold">
            Departamento:
          </span>
          <select
            className="Input"
            name="departmentId"
            onChange={handleChange}
            required
          >
            <option value="" unselectable="on" >-</option>
            {
              sortDepartments(departments).map(({ id, name }) =>
                <option value={id}>{name}</option>
              )
            }
          </select>
        </label>
        <Button
          type="submit"
          color="secondary"
          loading={loading}
        >
          Crear Empleado
        </Button>
      </form>
    </Modal>
  )
}

export default CreateEmployeeModal