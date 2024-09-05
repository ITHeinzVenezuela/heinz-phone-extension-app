import { z } from "zod"

const DeparmentSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const DeparmentIdSchema = DeparmentSchema.shape.id

export type Deparment = z.infer<typeof DeparmentSchema>
export type DeparmentId = z.infer<typeof DeparmentIdSchema>