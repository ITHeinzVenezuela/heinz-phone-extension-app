import sequelize from "@/lib/mssql";
import createHttpError from "http-errors";
import { Extension, ExtensionNumber } from "../_schemas/extension.schema";
import { getInsertAttributes } from "@/utils/api/insert";
import { getUPDATEValues } from "@/utils/api/update";

class ExtensionController {
  getAll = async () => {
    // Departamentos
    const queryString = `
      SELECT * FROM [HPE_Extensions]
    `
    const [data] = await sequelize.query(queryString) as [Extension[], unknown]
    return data;
  }

  findOne = async (number: Extension["number"]) => {
    // Trabajadores
    const queryString = `
      SELECT * FROM [HPE_Extensions]
      WHERE number = ${number}
    `

    const [data] = await sequelize.query(queryString) as [Extension[], unknown]
    return data?.length ? data[0] : null
  }

  create = async (extension: Extension) => {
    try {
      const foundExtension = await this.findOne(extension.number)

      if (!foundExtension) {

        const [keys, values] = getInsertAttributes(extension)

        // Extensions
        const queryString = `
          INSERT [HPE_Extensions]\n${keys}
          VALUES ${values}
        `

        const [data] = await sequelize.query(queryString) as [Extension[], unknown]

        return data[0]

      } else {
        throw createHttpError.BadRequest("Extension alredy exists!")
      }

    } catch (error) {
      console.log('error', error)
      throw createHttpError.BadRequest("Bad Extension Insert!")
    }
  }

  update = async (extensionNumber: ExtensionNumber, extension: Extension) => {
    
    if (extensionNumber) {
      
      const foundExtension = await this.findOne(extensionNumber)

      if (foundExtension) {
        try {
          const values = getUPDATEValues(extension)

          // Construye la cadena de valores a actualizar en la consulta SQL.
          const queryString = `
            UPDATE [HPE_Extensions]
            SET ${values}
            WHERE number = ${extensionNumber};
          `

          const [data] = await sequelize.query(queryString) as [Extension[], unknown]
          return data[0]

        } catch (error) {
          console.log('error', error)
          throw createHttpError.BadRequest("Extension Update Error")
        }

      } else {
        throw createHttpError.NotFound("Extension Not Found!")
      }
    }
  }

  delete = async (extensionNumber: Extension["number"]) => {
    try {
      const queryString = `
        DELETE FROM [HPE_Extensions]
        WHERE number = '${extensionNumber}'
      `
      await sequelize.query(queryString)

    } catch (error) {
      console.log('error', error)
      throw createHttpError.BadRequest("Extension DELETE Error")
    }
  }
}

export default ExtensionController;