import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import { EmployeeExtension, Extension, ExtensionNumber } from "../_schemas/extension.schema";
import { getInsertAttributes } from "@/utils/api/insert";
import { getUPDATEValues } from "@/utils/api/update";
import EmployeesController from "./employees.controller";
import { Employee } from "../_schemas/employee.schema";
import DeparmentController from "./departments.controller";
import { Department, DepartmentId } from "../_schemas/department.schema";

const employeeController = new EmployeesController()
const departmentController = new DeparmentController()

class ExtensionController {
  getAll = async (departmentId?: DepartmentId) => {
    // Departamentos
    const queryString = `
      SELECT * FROM [HPE_Extensions]
      ${departmentId !== "all" ? `WHERE departmentId = '${departmentId}'` : ""}
    `
    const [data] = await sequelize.query(queryString) as [Extension[], unknown]
    return data;
  }

  getAllInfo = async (departmentId: string | undefined) => {

    const extensions = await this.getAll(departmentId)
    const fichas = extensions.map(({ ficha }) => ficha)

    console.log('id2', departmentId)
    console.log('departmentId2: ', departmentId)

    let employees: Employee[] = []
    // Trabajadores
    if (departmentId === "all") {
      employees = await employeeController.findByFichas(fichas)
    } else if (departmentId) {
      employees = await employeeController.findBy("departmentId", departmentId)
    } else if (departmentId === "") {
      employees = await employeeController.getContractorsBy("departmentId", departmentId)
    }

    // Eliminando duplicados de IDs
    const departmentIds = [...new Set(employees.map(({ departmentId }) => departmentId))]

    if (employees.length) {

      // Departamentos
      const departments = await departmentController.findBy(departmentIds)

      const data: EmployeeExtension[] = employees.map((employee) => {
        const { ficha, departmentId } = employee

        const extension = extensions.filter((employee) => employee.ficha === ficha)
        const department = departments.find((department) => department.id === employee.departmentId) as Department

        return {
          number: extension.map(({ number }) => number),
          employee,
          department,
        }
      })

      return data;

    } else {
      return []
    }
  }

  findEmployee = async (name: Employee["name"]) => {

    const employees = await employeeController.findBy("name", name)

    if (employees.length) {

      const queryString2 = `
        SELECT * FROM [HPE_Extensions]
        WHERE ficha IN (${employees.map(({ ficha }) => `'${ficha}'`)})
      `

      // Eliminando duplicados de IDs
      const departmentIds = [...new Set(employees.map(({ departmentId }) => departmentId))]

      // Departamentos
      const departments = await departmentController.findBy(departmentIds)

      const [extensions] = await sequelize.query(queryString2) as [Extension[], unknown]

      const data: EmployeeExtension[] = employees.map((employee) => {
        const { ficha } = employee

        const extension = extensions.filter((employee) => employee.ficha === ficha)
        const department = departments.find((department) => department.id === employee.departmentId) as Department

        return {
          number: extension.map(({ number }) => number),
          employee,
          department,
        }
      })
      
      return data

    } else {
      return employees;
    }
  }

  findOne = async (number: Extension["number"]) => {
    // Extensiones
    const queryString = `
      SELECT * FROM [HPE_Extensions]
      WHERE number = ${number}
    `

    const [data] = await sequelize.query(queryString) as [Extension[], unknown]
    return data?.length ? data[0] : null
  }

  create = async (extension: Extension) => {
    try {
      // const foundExtension = await this.findOne(extension.number)

      // if (!foundExtension) {

      const [keys, values] = getInsertAttributes(extension)

      // Extensions
      const queryString = `
          INSERT [HPE_Extensions]\n${keys}
          VALUES ${values}
        `

      const [data] = await sequelize.query(queryString) as [Extension[], unknown]

      return data[0]

      // } else {
      //   throw createHttpError.BadRequest("Extension alredy exists!")
      // }

    } catch (error) {
      console.log('error', error)
      throw createHttpError.BadRequest("Bad Extension Insert!")
    }
  }

  update = async (extensionNumber: ExtensionNumber, extension: Extension) => {

    if (extensionNumber) {

      const foundExtension = await this.findOne(extensionNumber)

      if (foundExtension) {
        try {
          const values = getUPDATEValues(extension)

          // Construye la cadena de valores a actualizar en la consulta SQL.
          const queryString = `
            UPDATE [HPE_Extensions]
            SET ${values}
            WHERE number = ${extensionNumber};
          `

          const [data] = await sequelize.query(queryString) as [Extension[], unknown]
          return data[0]

        } catch (error) {
          console.log('error', error)
          throw createHttpError.BadRequest("Extension Update Error")
        }

      } else {
        throw createHttpError.NotFound("Extension Not Found!")
      }
    }
  }

  delete = async (numbers: string[] | string, ficha: Employee["ficha"]) => {
    console.log('numbers', numbers)
    console.log('ficha', ficha)
    try {
      const queryString = `
        DELETE FROM [HPE_Extensions]
        WHERE ficha = ${ficha}
        AND number IN (${numbers})
      `
      await sequelize.query(queryString)

    } catch (error) {
      console.log('error', error)
      throw createHttpError.BadRequest("Extension DELETE Error")
    }
  }
}

export default ExtensionController;