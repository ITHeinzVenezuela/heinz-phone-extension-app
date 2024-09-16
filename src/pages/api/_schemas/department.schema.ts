import { z } from "zod"

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
})

export const DepartmentSQLSchema = z.object({
  departmentId: z.string(),
})

export const DepartmentIdSchema = DepartmentSchema.shape.id

export type Department = z.infer<typeof DepartmentSchema>
export type DepartmentId = z.infer<typeof DepartmentIdSchema>
export type DepartmentSQL = z.infer<typeof DepartmentSQLSchema>