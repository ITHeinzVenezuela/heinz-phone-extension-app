import { z } from "zod";

export const ExtensionSchema = z.object({
  number: z.number(),
  departmentId: z.string(),
  ficha: z.string(),
})

export const ExtensionNumberSchema = ExtensionSchema.shape.number

export type Extension = z.infer<typeof ExtensionSchema>
export type ExtensionNumber = z.infer<typeof ExtensionNumberSchema>