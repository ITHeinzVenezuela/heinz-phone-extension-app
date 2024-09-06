import { z } from "zod"

const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const DepartmentIdSchema = DepartmentSchema.shape.id

export type Department = z.infer<typeof DepartmentSchema>
export type DepartmentId = z.infer<typeof DepartmentIdSchema>