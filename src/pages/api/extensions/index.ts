import type { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "../_middlewares/errorHandler";
import { CREATED, NO_CONTENT, OK } from "http-status";
import { Extension, ExtensionNumberSchema, ExtensionSchema } from "../_schemas/extension.schema";
import createHttpError from "http-errors";
import ExtensionController from "../_controllers/extension.controller";
import { Extensions } from "sequelize/types/utils/validator-extras";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
  ]
  return HTTP_METHODS.includes(method)
}

const extensionHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const METHOD = request.method as string
    const extension = new ExtensionController()
    console.log("department handler")

    if (allowedMethods(METHOD)) {

      if (METHOD === "GET") {
        const number = request.query.number as string
        if (number) {

          const validatedNumber = ExtensionNumberSchema.parse(parseInt(number))
          const foundExtension = await extension.findOne(validatedNumber)
          response.status(OK).json(foundExtension)

        } else {
          const extensions = await extension.getAll()
          response.status(OK).json(extensions)
        }
      }

      if (METHOD === "POST") {
        const validatedFormat = ExtensionSchema.parse(request.body)
        const createdExtension = await extension.create(validatedFormat)
        response.status(CREATED).json(createdExtension);
      }

      if (METHOD === "PUT") {
        const number = parseInt(request.query.number as string)
        const validatedFormat = ExtensionSchema.parse(request.body)
        const validatedNumber = ExtensionNumberSchema.parse(number)
        const updatedExtension = await extension.update(validatedNumber, validatedFormat)
        response.status(OK).json(updatedExtension);
      }

      if (METHOD === "DELETE") {
        const number = request.query.number as string | string[]
        const ficha = request.query.ficha as string
        await extension.delete(number, ficha)
        response.status(NO_CONTENT).json(undefined);
      }

    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default extensionHandler;