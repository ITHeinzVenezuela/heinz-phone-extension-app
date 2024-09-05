import { z } from "zod";

const EmployeeSchema = z.object({
  ficha: z.string(),
  name: z.string(),
  cedula: z.string(),
  departmentId: z.string(),
  // phoneExtension: z.number(),
  // date: z.string(),
})

export const EmployeeIdSchema = EmployeeSchema.shape.ficha
export const FindEmployeeBySchema = EmployeeSchema.omit({ name: true }).keyof()

export type Employee = z.infer<typeof EmployeeSchema>
export type EmployeeId = z.infer<typeof EmployeeIdSchema>
export type FindEmployeeBy = z.infer<typeof FindEmployeeBySchema>
