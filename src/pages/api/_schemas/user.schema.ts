import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const UserEmailSchema = UserSchema.shape.email
export const CreateUserSchema = UserSchema.omit({ id: true })
export const UpdateUserSchema = UserSchema.partial()

export type User = z.infer<typeof UserSchema>
export type UserEmail = z.infer<typeof UserEmailSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>

export type UserCredentials = Omit<User, "id" | "password">