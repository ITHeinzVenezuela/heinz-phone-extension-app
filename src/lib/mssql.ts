import axios from "axios"
import { Sequelize } from "sequelize"
import tedious from "tedious"

const ENVIRONMENT = process.env.NODE_ENV as string

const dbHost = process.env.DB_HOST as string
const dbUser = process.env.DB_USER as string
const dbName = process.env.DB_NAME as string
const dbPassword = process.env.DB_PASSWORD as string
const dbInstance = process.env.DB_INSTANCE as string
const dbPort = process.env.DB_PORT as string

const MINUTE = 60 * 1000;

// const getSequelize = async () => {

  type DB_CREDENTIALS = {
    DB_HOST: string,
    DB_NAME: string,
    DB_USER: string,
    DB_PASSWORD: string,
  }

  // const secretName = "DB-CREDENTIALS"

  // const credentials = await getSecrets()
  
  // console.log("credential", credentials)

  // const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD }: DB_CREDENTIALS = JSON.parse(credentials as string)

  const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: 1433,
    dialect: "mssql",
    dialectModule: tedious,
    dialectOptions: {
      options: {
        instanceName: dbInstance,
        trustServerCertificate: true, // change to true for local dev / self-signed certs,
        encrypt: false,
        connectTimeout: MINUTE / 2,
        requestTimeout: 20 * MINUTE,
      }
    }
  })
  
  // return sequelize;
// }

// export default getSequelize;

export default sequelize;