import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import type { Deparment, DeparmentId } from "../_schemas/department.schema";

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
    const [data] = await sequelize.query(queryString) as [Deparment[], unknown]
    return data;
  }

  findOne = async (departmentId: DeparmentId) => {
    // Trabajadores
    const queryString = `
      SELECT ${fields} FROM [MEDICO_Departamento]
      WHERE COD_infocet = ${departmentId}
    `
    
    const [data] = await sequelize.query(queryString) as [unknown[], unknown]

    if (data?.length) {
      return data
    } else {
      throw createHttpError.NotFound("Deparment not found!")
    }
  }

}

export default DeparmentController;