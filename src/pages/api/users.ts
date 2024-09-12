import type { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "./_middlewares/errorHandler";
import { CREATED, NO_CONTENT, OK } from "http-status";
import createHttpError from "http-errors";
import { CreateUserSchema, UpdateUserSchema, UserEmailSchema } from "./_schemas/user.schema";
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
        const email = request.query.email as string
        if (email) {
          console.log('email', email)
          const validatedEmail = UserEmailSchema.parse(email)
          const foundUser = await user.findOne(validatedEmail)
          console.log('foundUser', foundUser)
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
        const userEmail = request.query.email as string
        const validatedId = UserEmailSchema.parse(userEmail)
        const validatedFormat = UpdateUserSchema.parse(request.body)
        const updatedUser = await user.update(validatedId, validatedFormat)
        response.status(OK).json(updatedUser);
      }

      if (METHOD === "DELETE") {
        const { email } = request.query
        const validatedEmail = UserEmailSchema.parse(email as string)
        await user.delete(validatedEmail)
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
