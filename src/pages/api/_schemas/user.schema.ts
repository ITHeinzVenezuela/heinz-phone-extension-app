import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
})

export const UserIdSchema = UserSchema.shape.id
export const CreateUserSchema = UserSchema.omit({ id: true })
export const UpdateUserSchema = UserSchema.partial()

export type User = z.infer<typeof UserSchema>
export type UserId = z.infer<typeof UserIdSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>