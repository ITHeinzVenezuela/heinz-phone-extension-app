import { Employee } from "@/pages/api/_schemas/employee.schema";
import API from "./api"

class EmployeesService {
  getAll = async () => {
    const { data } = await API.get<Employee[]>("/api/employees")
    return data;
  }
 
  findOne = async (ficha: Employee["ficha"]) => {
    const { data } = await API.get<Employee[]>(`/api/employees?ficha=${ficha}`)
    return data[0];
  }
  
  create = async (employee: Employee) => {
    await API.post<Employee[]>(`/api/employees`, employee)
  }
  
  update = async (ficha: Employee["ficha"], employee: Employee) => {
    await API.put<Employee[]>(`/api/employees?ficha=${ficha}`, employee)
  }
  
  delete = async (ficha: Employee["ficha"]) => {
    await API.delete<Employee[]>(`/api/employees?ficha=${ficha}`)
  }
}

export default EmployeesService;