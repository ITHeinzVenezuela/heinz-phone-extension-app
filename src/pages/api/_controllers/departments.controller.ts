import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import type { Department, DepartmentId } from "../_schemas/department.schema";
import { sortDepartments } from "@/utils";

const fields = `
  COD_infocet as id, 
  Descripcion AS name
`

const OTHERS_DEPARTMENT = {
  id: "OTROS",
  name: "OTROS",
}

class DeparmentController {
  getAll = async () => {
    // Departamentos
    const queryString = `
      SELECT ${fields} FROM [MEDICO_Departamento]
    `
    const [data] = await sequelize.query(queryString) as [Department[], unknown]

    const departments = sortDepartments(data)

    departments.unshift(OTHERS_DEPARTMENT)

    return departments;
  }

  findBy = async (departmentIds: Department["id"][]) => {
    // Trabajadores
    console.log(departmentIds);
    const queryString = `
      SELECT ${fields} FROM [MEDICO_Departamento]
      WHERE COD_infocet IN (${departmentIds.map((id) => `'${id}'`)})
    `

    const [data] = await sequelize.query(queryString) as [Department[], unknown]

    data.unshift(OTHERS_DEPARTMENT)

    if (data?.length) {
      return data
    } else {
      throw createHttpError.NotFound("Deparments not found!")
    }
  }

}

export default DeparmentController;