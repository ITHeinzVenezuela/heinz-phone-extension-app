import type { NextApiRequest, NextApiResponse } from "next";
import status, { OK } from "http-status";
import createHttpError from "http-errors";
import EmployeesController from "./_controllers/employees.controller";
import { EmployeeIdSchema, FindEmployeeBySchema } from "./_schemas/employee.schema";
import { errorHandler } from "./_middlewares/errorHandler";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    "POST",
    // "PUT",
    // "DELETE",
  ]
  return HTTP_METHODS.includes(method)
}

const employeeHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const METHOD = request.method as string
    const employee = new EmployeesController()
    console.log("employee handler")

    if (allowedMethods(METHOD)) {
      
      if (METHOD === "GET") {
        const employees = await employee.getAll()
        response.status(OK).json(employees)
      }
      
      if(METHOD === "POST"){
        const field = Object.keys(request.body)[0]
        const value = Object.values(request.body)[0]
        
        const validatedField = FindEmployeeBySchema.parse(field)
        const validatedValue = EmployeeIdSchema.parse(value)
        
        const foundEmployee = await employee.findBy(validatedField, validatedValue)
        response.status(OK).json(foundEmployee)
      }
      
      // if(METHOD === "PUT"){

      // }
      
      // if(METHOD === "DELETE"){

      // }
      
    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default employeeHandler;
