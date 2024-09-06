import { Employee } from "@/pages/api/_schemas/employee.schema";
import API from "./api";
import { Department, DepartmentId } from "@/pages/api/_schemas/department.schema";

class DeparmentService {
  getAll = async () => {
    const { data } = await API.get<Department[]>("/api/departments")
    return data;
  }

  findOne = async (departmentId: DepartmentId) => {
    const { data } = await API.get<Department>(`/api/departments?id=${departmentId}`)
    return data;
  }
}

export default DeparmentService;