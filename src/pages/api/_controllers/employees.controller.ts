import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import type { Employee, FindEmployeeBy } from "../_schemas/employee.schema";

const fields = `
  FICHA as ficha, 
  NOMBRE as name, 
  CEDULA as cedula, 
  CODDEP as departmentId
`

const formatData = (data: Employee[]) => {
  const employees = data.map(({ ficha, cedula, name, ...rest }) => ({
    name: name.replaceAll("#", "Ñ"),
    ficha: ficha.trim(),
    cedula: cedula.trim(),
    ...rest,
  }))
  return employees;
}

class EmployeesController {
  getAll = async () => {
    // Trabajadores
    const queryString = `
      SELECT ${fields} FROM OPENQUERY (JDE, '
        SELECT * FROM spi.nmpp007 
        WHERE status = ''1''
      ')
    `
    const [data] = await sequelize.query(queryString) as [Employee[], unknown]
    const employees = formatData(data)
    
    return employees;
  }

  findBy = async (field: FindEmployeeBy, value: Employee["ficha"] |  Employee["departmentId"]) => {
    
    const tableField = field === "departmentId" ? "CODDEP" : field
    
    // Trabajadores
    const queryString = `
      SELECT ${fields} FROM OPENQUERY (JDE, '
        SELECT * FROM spi.nmpp007 
        WHERE status = ''1''
        AND TRIM(${tableField}) LIKE ''${value}''
      ')
    `
    const [data] = await sequelize.query(queryString) as [Employee[], unknown]

    // if (data?.length) {
      const foundEmployee = formatData(data)
      return foundEmployee;
    // } else {
    //   throw createHttpError.NotFound("Employee not found!")
    // }
  }
  
  findByFichas = async (fichas: Employee["ficha"][]) => {

    // Trabajadores
    const queryString = `
      SELECT ${fields} FROM OPENQUERY (JDE, '
        SELECT * FROM spi.nmpp007 
        WHERE status = ''1''
        AND TRIM(ficha) IN (${fichas.map((ficha) => `''${ficha}''`)})
      ')
    `
    const [data] = await sequelize.query(queryString) as [Employee[], unknown]

    // if (data?.length) {
      const foundEmployee = formatData(data)
      return foundEmployee;
    // } else {
    //   throw createHttpError.NotFound("Employee not found!")
    // }
  }
}

export default EmployeesController;