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
  modifyEmployee?: Employee,
  setModal: Dispatch<SetStateAction<boolean>>,
  searchExtensions: () => Promise<void>,
  departments: Department[],
}

const CreateEmployeeModal = ({ showModal, setModal, modifyEmployee, searchExtensions, departments }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)

  const defaulValue = {
    ficha: "",
    name: "",
    cedula: "",
    departmentId: "",
    contractor: true,
  }

  const [employee, setEmployee] = useState<Employee>(modifyEmployee ? modifyEmployee : defaulValue)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      console.log('employee', employee)

      const employeeService = new EmployeesService()
      
      if(modifyEmployee){
        await employeeService.update(modifyEmployee.ficha, employee)
      }else{
        await employeeService.create(employee)
      }

      await searchExtensions()
      
      alert("Se ha creado el empleado exitosamente")

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

  const { name, ficha, departmentId } = employee

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
            {/* <option value="">Otros</option> */}
            {
              departments.map(({ id, name }) => {
                return (
                  <option value={id} selected={id === departmentId}>{name}</option>
                )
              })
            }
          </select>
        </label>
        <Button
          type="submit"
          color="secondary"
          loading={loading}
        >
          {modifyEmployee ? "Modificar Empleado" : "Crear Empleado"}
        </Button>
      </form>
    </Modal>
  )
}

export default CreateEmployeeModal