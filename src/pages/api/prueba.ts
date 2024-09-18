import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { DepartmentSQL } from "./_schemas/department.schema";

const userHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const queryString = `
      SELECT * FROM [HCRM01].[dbo].[HPE_Departments]
      ORDER BY departmentId DESC
    `

    const [data] = await sequelize.query(queryString) as [DepartmentSQL[], unknown]

    response.status(200).json([...new Set(data.map(({ departmentId }) => departmentId))])
    
  } catch (error) {
    response.status(500).json({})
  }
}

export default userHandler;
