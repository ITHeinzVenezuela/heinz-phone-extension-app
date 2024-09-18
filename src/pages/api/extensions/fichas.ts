import type { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "../_middlewares/errorHandler";
import { CREATED, NO_CONTENT, OK } from "http-status";
import { Extension, ExtensionNumberSchema, ExtensionSchema } from "../_schemas/extension.schema";
import createHttpError from "http-errors";
import ExtensionController from "../_controllers/extension.controller";
import { Extensions } from "sequelize/types/utils/validator-extras";
import { Employee, EmployeeFichaSchema, EmployeeSchema } from "../_schemas/employee.schema";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    "POST",
    // "PUT",
    // "DELETE",
  ]
  return HTTP_METHODS.includes(method)
}

const extensionHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const METHOD = request.method as string
    const extension = new ExtensionController()
    
    if (allowedMethods(METHOD)) {

      if (METHOD === "GET") {
        const departmentId = request.query.departmentId
        const extensions = await extension.getAllInfo(departmentId as string)
        response.status(OK).json(extensions)
      }
      
      if (METHOD === "POST") {
        const name = request.body.name as Employee["name"]
        const validatedName = EmployeeSchema.shape.name.parse(name)
        const employee = await extension.findEmployee(validatedName)
        response.status(OK).json(employee)
      }

    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default extensionHandler;