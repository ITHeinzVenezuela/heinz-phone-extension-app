import type { NextApiRequest, NextApiResponse } from "next";
import status, { OK } from "http-status";
import createHttpError from "http-errors";
import DeparmentController from "./_controllers/departments.controller";
import { errorHandler } from "./_middlewares/errorHandler";
import { DeparmentIdSchema } from "./_schemas/department.schema";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    // "POST",
    // "PUT",
    // "DELETE",
  ]
  return HTTP_METHODS.includes(method)
}

const departmentHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const METHOD = request.method as string
    const deparment = new DeparmentController()
    console.log("department handler")

    if (allowedMethods(METHOD)) {

      if (METHOD === "GET") {
        const departmentId = request.query.id as string
        if (departmentId) {

          const validatedId = DeparmentIdSchema.parse(departmentId)
          const foundExtension = await deparment.findOne(validatedId)
          response.status(OK).json(foundExtension)

        } else {
          const deparments = await deparment.getAll()
          response.status(OK).json(deparments)
        }

      }

      // if(METHOD === "POST"){

      // }

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

export default departmentHandler;
