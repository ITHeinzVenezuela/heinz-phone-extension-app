import { z } from "zod";

export const EmployeeSchema = z.object({
  ficha: z.string(),
  name: z.string(),
  cedula: z.string(),
  departmentId: z.string(),
  contractor: z.boolean(),
  // phoneExtension: z.number(),
  // date: z.string(),
})

export const EmployeeFichaSchema = EmployeeSchema.shape.ficha
export const FindEmployeeBySchema = EmployeeSchema.omit({ name: true }).keyof()

export type Employee = z.infer<typeof EmployeeSchema>
export type EmployeeFicha = z.infer<typeof EmployeeFichaSchema>
export type FindEmployeeBy = z.infer<typeof FindEmployeeBySchema>
