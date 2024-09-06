import type { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "../_middlewares/errorHandler";
import { CREATED, NO_CONTENT, OK } from "http-status";
import { Extension, ExtensionNumberSchema, ExtensionSchema } from "../_schemas/extension.schema";
import createHttpError from "http-errors";
import ExtensionController from "../_controllers/extension.controller";
import { Extensions } from "sequelize/types/utils/validator-extras";
import { Employee } from "../_schemas/employee.schema";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    // "POST",
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
        console.log("departmentId", departmentId);
        const extensions = await extension.getAllInfo(departmentId as string)
        response.status(OK).json(extensions)
      }

    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default extensionHandler;