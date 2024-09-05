import type { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "./_middlewares/errorHandler";
import { CREATED, NO_CONTENT, OK } from "http-status";
import { ExtensionNumberSchema, ExtensionSchema } from "./_schemas/extension.schema";
import createHttpError from "http-errors";
import ExtensionController from "./_controllers/extension.controller";
import { CreateUserSchema, UpdateUserSchema, UserIdSchema } from "./_schemas/user.schema";
import UserController from "./_controllers/user.controller";

const allowedMethods = (method: string) => {
  const HTTP_METHODS = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
  ]
  return HTTP_METHODS.includes(method)
}

const userHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const METHOD = request.method as string
    const user = new UserController()
    console.log("user handler")

    if (allowedMethods(METHOD)) {

      if (METHOD === "GET") {
        const userId = parseInt(request.query.userId as string)
        if (userId) {

          const validatedId = UserIdSchema.parse(userId)
          const foundUser = await user.findOne(validatedId)
          response.status(OK).json(foundUser)

        } else {
          const users = await user.getAll()
          response.status(OK).json(users)
        }
      }

      if (METHOD === "POST") {
        const validatedFormat = CreateUserSchema.parse(request.body)
        const createdExtension = await user.create(validatedFormat)
        response.status(CREATED).json(createdExtension);
      }

      if (METHOD === "PUT") {
        const userId = parseInt(request.query.userId as string)
        const validatedId = UserIdSchema.parse(userId)
        const validatedFormat = UpdateUserSchema.parse(request.body)
        const updatedUser = await user.update(validatedId, validatedFormat)
        response.status(OK).json(updatedUser);
      }

      if (METHOD === "DELETE") {
        const { userId } = request.query
        const validatedId = UserIdSchema.parse(parseInt(userId as string))
        await user.delete(validatedId)
        response.status(NO_CONTENT).json(undefined);
      }

    } else {
      throw new createHttpError.MethodNotAllowed("Bad Request!")
    }

  } catch (error) {
    errorHandler(error, request, response)
  }
}

export default userHandler;
