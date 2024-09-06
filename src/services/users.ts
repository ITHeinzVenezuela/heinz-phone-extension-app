import { CreateUser, UpdateUser, User, UserEmail } from "@/pages/api/_schemas/user.schema";
import API from "./api";

class UserService {
  getAll = async () => {
    const { data } = await API.get<User[]>("/api/users")
    return data;
  }

  findOne = async (email: User["email"]) => {
    const { data } = await API.get<User>(`/api/users?email=${email}`)
    return data;
  }

  create = async (userInfo: CreateUser) => {
    const { data } = await API.post<User>(`/api/users`, userInfo)
    return data;
  }

  update = async (email: User["email"], userInfo: UpdateUser) => {
    const { data } = await API.put<User>(`/api/users?email=${email}`, userInfo)
    return data;
  }

  delete = async (email: User["email"]) => {
    await API.delete(`/api/users?email=${email}`)
  }
}

export default UserService;