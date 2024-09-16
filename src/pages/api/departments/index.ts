import type { NextApiRequest, NextApiResponse } from "next";
import status, { OK } from "http-status";
import createHttpError from "http-errors";
import DeparmentController from "../_controllers/departments.controller";
import { errorHandler } from "../_middlewares/errorHandler";
import { Department, DepartmentIdSchema } from "../_schemas/department.schema";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    "POST",
    // "PUT",
    // "DELETE",
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
        const deparments = await deparmentController.getAll()
        response.status(OK).json(deparments)
      }

      if (METHOD === "POST") {
        const departmentIds: Department["id"][] = request.body
        const deparments = await deparmentController.findBy(departmentIds)
        response.status(OK).json(deparments)
      }

    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default departmentHandler;
