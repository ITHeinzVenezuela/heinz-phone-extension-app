import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import { Extension } from "../_schemas/extension.schema";
import { getInsertAttributes } from "@/utils/api/insert";
import { getUPDATEValues } from "@/utils/api/update";
import { CreateUser, UpdateUser, User } from "../_schemas/user.schema";
import { use } from "react";

class UserController {
  getAll = async () => {
    // Usuarios
    const queryString = `
      SELECT * FROM [HPE_Users]
    `
    const [data] = await sequelize.query(queryString) as [User[], unknown]
    return data;
  }

  findOne = async (email: User["email"]) => {
    // Usuario
    const queryString = `
      SELECT * FROM [HPE_Users]
      WHERE email = '${email}'
    `

    const [data] = await sequelize.query(queryString) as [User[], unknown]

    if (data?.length) {
      return data[0]
    } else {
      throw createHttpError.NotFound("User not found!")
    }
  }

  create = async (userInfo: CreateUser) => {
    try {
      // const foundUser = await this.findOne(userInfo.number)

      // if (!foundUser) {

      const [keys, values] = getInsertAttributes(userInfo)

      // Extensions
      const queryString = `
          INSERT [HPE_Users]\n${keys}
          VALUES ${values}
        `

      const [data] = await sequelize.query(queryString) as [User[], unknown]

      return data[0]

      // } else {
      //   throw createHttpError.BadRequest("User alredy exists!")
      // }

    } catch (error) {
      console.log('error', error)
      throw createHttpError.BadRequest("Bad User Insert!")
    }
  }

  update = async (email: User["email"], userInfo: UpdateUser) => {

    const foundUser = await this.findOne(email)

    if (foundUser) {
      try {
        const values = getUPDATEValues(userInfo)

        // Construye la cadena de valores a actualizar en la consulta SQL.
        const queryString = `
          UPDATE [HPE_Users]
          SET ${values}
          WHERE email = '${email}';
        `

        const [data] = await sequelize.query(queryString) as [User[], unknown]
        return data[0];

      } catch (error) {
        console.log('error', error)
        throw createHttpError.BadRequest("User Update Error")
      }

    } else {
      throw createHttpError.NotFound("User Not Found!")
    }
  }

  delete = async (email: User["email"]) => {
    try {
      const queryString = `
        DELETE FROM [HPE_Users]
        WHERE email = '${email}'
      `
      await sequelize.query(queryString)

    } catch (error) {
      console.log('error', error)
      throw createHttpError.BadRequest("User DELETE Error")
    }
  }
}

export default UserController;