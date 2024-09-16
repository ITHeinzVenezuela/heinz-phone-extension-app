import type { NextApiRequest, NextApiResponse } from "next";
import status, { CREATED, NO_CONTENT, OK } from "http-status";
import createHttpError from "http-errors";
import DeparmentController from "../_controllers/departments.controller";
import { errorHandler } from "../_middlewares/errorHandler";
import { Department, DepartmentIdSchema } from "../_schemas/department.schema";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    "POST",
    "DELETE",
  ]
  return HTTP_METHODS.includes(method)
}

const departmentHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const METHOD = request.method as string
    const deparmentController = new DeparmentController()
    console.log("department handler")

    if (allowedMethods(METHOD)) {

      if (METHOD === "GET") {
        const deparments = await deparmentController.verifyActiveDepartments()
        response.status(OK).json(deparments)
      }

      if (METHOD === "POST") {
        const departmentId: Department["id"] = request.body.departmentId
        const deparments = await deparmentController.activate(departmentId)
        response.status(CREATED).json(deparments)
      }

      if(METHOD === "DELETE"){
        const departmentId = request.query.id as Department["id"]
        await deparmentController.desactivate(departmentId)
        response.status(NO_CONTENT).json(undefined)
      }

    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default departmentHandler;
