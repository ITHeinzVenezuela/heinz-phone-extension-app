import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import createError from 'http-errors'

export const errorHandler = (error: unknown, request: NextApiRequest, response: NextApiResponse) => {
  console.log('zodErrorHandler')

  if (error instanceof ZodError) {
    const httpError = new createError.BadRequest()

    const { issues } = error
    const { statusCode, message, name } = httpError

    response.status(statusCode).json({
      statusCode, name, issues, message
    })
  } else {
    httpErrorHandler(error, request, response)
  }
}

const httpErrorHandler = (error: unknown, request: NextApiRequest, response: NextApiResponse) => {
  console.log('HttpError Handler')

  if (createError.isHttpError(error)) {

    const { statusCode, message, name } = error
    response.status(statusCode).json({ statusCode, name, message })

  } else {
    serverErrorHandler(error, request, response)
  }
}

const serverErrorHandler = (error: unknown, request: NextApiRequest, response: NextApiResponse) => {
  console.log('Error Handler')

  if (error instanceof Error) {
    const httpError = new createError.InternalServerError()
    const { statusCode, message, name } = httpError

    response.status(statusCode).json({ statusCode, message, name })
  }
}