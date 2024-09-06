import { Employee } from "@/pages/api/_schemas/employee.schema";
import API from "./api"

class EmployeesService {
  getAll = async () => {
    const { data } = await API.get<Employee[]>("/api/employees")
    return data;
  }
  findBy = async (body: any) => {
    const { data } = await API.post<Employee[]>("/api/employees", body)
    return data;
  }
  findOne = async (ficha: Employee["ficha"]) => {
    const { data } = await API.post<Employee[]>("/api/employees", { ficha })
    return data[0];
  }
}

export default EmployeesService;