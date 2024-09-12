import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import type { Employee, FindEmployeeBy } from "../_schemas/employee.schema";
import { getInsertAttributes } from "@/utils/api/insert";
import { getUPDATEValues } from "@/utils/api/update";

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

  getContractorsBy = async (field: FindEmployeeBy, value: string | Employee["departmentId"]) => {
    // Trabajadores Contratas
    const queryString2 = `
      SELECT * FROM [HCRM01].[dbo].[HPE_Employees]
      WHERE ${field} = '${value}'
    `
    const [contractorEmployees] = await sequelize.query(queryString2) as [Employee[], unknown]
    return contractorEmployees;
  }
  
  findBy = async (field: FindEmployeeBy, value: string | Employee["departmentId"]) => {

    const tableField = field === "departmentId" ? "CODDEP" : field

    // Trabajadores Heinz
    const queryString1 = `
      SELECT ${fields} FROM OPENQUERY (JDE, '
        SELECT * FROM spi.nmpp007 
        WHERE status = ''1''
        AND TRIM(${tableField}) LIKE ''${value}''
      ')
    `
    
    // Trabajadores Contratas
    const contractorEmployees = await this.getContractorsBy(field, value)
    
    const [heinzEmployees] = await sequelize.query(queryString1) as [Employee[], unknown]
    
    const heinzData = heinzEmployees.map((employee)=>{
      return {
        ...employee,
        contractor: false,
      }
    })
    
    const employees = [...heinzData, ...contractorEmployees]
    
    // if (data?.length) {
    const foundEmployees = formatData(employees)
    return foundEmployees;
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

  create = async (employee: Employee) => {
    const foundEmployees = await this.findBy("ficha", employee.ficha)
    
    if(!foundEmployees.length){
      try {
        const [keys, values] = getInsertAttributes(employee)
  
        // Extensions
        const queryString = `
          INSERT [HPE_Employees]\n${keys}
          VALUES ${values}
        `
  
        const [data] = await sequelize.query(queryString) as [Employee[], unknown]
  
        const createdEmployee = data[0];
        return createdEmployee;
  
      } catch (error) {
        console.log(error);
        throw createHttpError.BadRequest("Bad Employee Insert!")
      }
    }else{
      throw createHttpError.BadRequest(`Contractor Employee with ficha "${employee.ficha}" Already Exits!`)
    }
  }

  update = async (ficha: Employee["ficha"], employee: Employee) => {
    
    const foundEmployee = await this.findBy("ficha", ficha)
    
    if(foundEmployee.length){
      try {
        
        const values = getUPDATEValues(employee)
  
        // Construye la cadena de valores a actualizar en la consulta SQL.
        const queryString = `
          UPDATE [HPE_Employees]
          SET ${values}
          WHERE ficha = ${ficha};
        `
        
        const [data] = await sequelize.query(queryString) as [Employee[], unknown]
        
        const updatedEmployee = data[0];
        return updatedEmployee;
        
      } catch (error) {
        console.log(error);
        throw createHttpError.BadRequest("Bad Employee Update!")
      }
    }else{
      throw createHttpError.NotFound("Employee Not Found!")
    }
  }
  
  delete = async (ficha: Employee["ficha"]) => {
    try {
      const queryString = `
        DELETE FROM [HPE_Employees]
        WHERE ficha = '${ficha}'
      `
      await sequelize.query(queryString)

    } catch (error) {
      console.log('error', error)
      throw createHttpError.BadRequest("Employee DELETE Error")
    }
  }
}

export default EmployeesController;