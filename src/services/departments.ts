import { Employee } from "@/pages/api/_schemas/employee.schema";
import API from "./api";
import { Department, DepartmentId } from "@/pages/api/_schemas/department.schema";

class DepartmentService {
  getAll = async () => {
    const { data } = await API.get<Department[]>("/api/departments")
    return data;
  }

  findOne = async (departmentId: DepartmentId) => {
    const { data } = await API.get<Department>(`/api/departments?id=${departmentId}`)
    return data;
  }

  verifyActiveDepartments = async () => {
    const { data } = await API.get<Department>(`/api/departments/activate`)
    return data;
  }

  activate = async (departmentId: DepartmentId) => {
    const { data } = await API.post<Department>(`/api/departments/activate`, { departmentId })
    return data;
  }

  desactivate = async (departmentId: DepartmentId) => {
    const { data } = await API.delete<Department>(`/api/departments/activate?id=${departmentId}`)
    return data;
  }
}

export default DepartmentService;