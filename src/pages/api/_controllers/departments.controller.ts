import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import type { Department, DepartmentId } from "../_schemas/department.schema";

const fields = `
  COD_infocet as id, 
  Descripcion AS name
`

class DeparmentController {
  getAll = async () => {
    // Departamentos
    const queryString = `
      SELECT ${fields} FROM [MEDICO_Departamento]
    `
    const [data] = await sequelize.query(queryString) as [Department[], unknown]
    return data;
  }

  findBy = async (departmentIds: Department["id"][]) => {
    // Trabajadores
    console.log(departmentIds);
    const queryString = `
      SELECT ${fields} FROM [MEDICO_Departamento]
      WHERE COD_infocet IN (${departmentIds})
    `
    
    const [data] = await sequelize.query(queryString) as [Department[], unknown]

    if (data?.length) {
      return data
    } else {
      throw createHttpError.NotFound("Deparments not found!")
    }
  }

}

export default DeparmentController;