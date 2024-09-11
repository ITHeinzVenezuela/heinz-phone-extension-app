import type { NextApiRequest, NextApiResponse } from "next";
import status, { CREATED, NO_CONTENT, OK } from "http-status";
import createHttpError from "http-errors";
import EmployeesController from "./_controllers/employees.controller";
import { EmployeeFichaSchema, FindEmployeeBySchema, FindEmployeeBy, EmployeeSchema, EmployeeFicha } from "./_schemas/employee.schema";
import { errorHandler } from "./_middlewares/errorHandler";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
  ]
  return HTTP_METHODS.includes(method)
}


type QueryProps = {
  field: string,
  value: string,
}

const employeeHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const METHOD = request.method as string
    const employeeController = new EmployeesController()
    console.log("employee handler")

    if (allowedMethods(METHOD)) {

      if (METHOD === "GET") {

        const field = Object.keys(request.query)[0] as FindEmployeeBy
        const value = Object.values(request.query)[0] as string
        
        // Find By
        if (field && value) {
          
          const validatedField = FindEmployeeBySchema.parse(field)
          const validatedValue = EmployeeFichaSchema.parse(value)

          const foundEmployee = await employeeController.findBy(validatedField, validatedValue)
          response.status(OK).json(foundEmployee)
          
        } else {
          const employees = await employeeController.getAll()
          response.status(OK).json(employees)
        }
      }

      if (METHOD === "POST") {
        const validatedFormat = EmployeeSchema.parse(request.body)
        const createdEmployee = await employeeController.create(validatedFormat)
        response.status(CREATED).json(createdEmployee);
      }

      if (METHOD === "PUT") {
        const number = parseInt(request.query.number as string)
        
        const validatedFormat = EmployeeSchema.parse(request.body)
        const validatedFicha = EmployeeFichaSchema.parse(number)
        
        const updatedEmployee = await employeeController.update(validatedFicha, validatedFormat)
        response.status(OK).json(updatedEmployee);
      }

      if (METHOD === "DELETE") {
        const ficha = request.query.ficha as EmployeeFicha
        const validatedFicha = EmployeeFichaSchema.parse(ficha)
        await employeeController.delete(validatedFicha)
        response.status(NO_CONTENT).json(undefined);
      }

    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default employeeHandler;
