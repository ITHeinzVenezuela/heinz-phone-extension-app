import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import type { Department, DepartmentSQL } from "../_schemas/department.schema";
import { sortDepartments } from "@/utils";

const fields = `
  COD_infocet as id, 
  Descripcion AS name
`

const OTHERS_DEPARTMENT = {
  id: "OTROS",
  name: "OTROS",
  active: true,
}

class DeparmentController {

  getAll = async () => {
    
    // Departamentos
    const queryString = `
      SELECT ${fields} FROM [MEDICO_Departamento]
    `
    const [data] = await sequelize.query(queryString) as [Department[], unknown]
    
    const depsData = await this.verifyActiveDepartments()

    let departments = sortDepartments(data)

    departments = departments.map((deparment) => {
      return {
        ...deparment,
        active: Boolean(depsData.find(({ departmentId }) => departmentId === deparment.id))
      }
    })

    departments.unshift(OTHERS_DEPARTMENT)
    console.log('departments', departments)
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

  verifyActiveDepartments = async () => {
    const queryString = `
      SELECT * FROM [HPE_Departments]
    `
    const [data] = await sequelize.query(queryString) as [DepartmentSQL[], unknown]
    return data;
  }

  activate = async (departmentId: Department["id"]) => {
    const queryString = `
      INSERT INTO [HPE_Departments]
      (departmentId) VALUES ('${departmentId}')
    `
    await sequelize.query(queryString)
  }

  desactivate = async (departmentId: Department["id"]) => {
    const queryString = `
      DELETE [HPE_Departments]
      WHERE departmentId = '${departmentId}';
    `
    await sequelize.query(queryString)
  }
}

export default DeparmentController;