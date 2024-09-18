import { DepartmentId } from "@/pages/api/_schemas/department.schema";
import API from "./api";
import { EmployeeExtension, Extension, ExtensionNumber } from "@/pages/api/_schemas/extension.schema";
import { Employee } from "@/pages/api/_schemas/employee.schema";

class ExtensionService {
  getAll = async () => {
    const { data } = await API.get<Extension[]>("/api/extensions")
    return data;
  }

  getAllInfo = async (departmentId: DepartmentId) => {
    const { data } = await API.get<EmployeeExtension[]>(`/api/extensions/fichas?departmentId=${departmentId}`)
    return data;
  }

  findOne = async (number: ExtensionNumber) => {
    const { data } = await API.get<Extension | null>(`/api/extensions?number=${number}`)
    return data;
  }

  findEmployee = async (name: Employee["name"]) => {
    const { data } = await API.post<EmployeeExtension[]>(`/api/extensions/fichas`, { name })
    return data;
  }

  create = async (extension: Extension) => {
    const { data } = await API.post<Extension>(`/api/extensions`, extension)
    return data;
  }

  update = async (number: ExtensionNumber, extension: Extension) => {
    const { data } = await API.put<Extension>(`/api/extensions?number=${number}`, extension)
    return data;
  }

  delete = async (number: ExtensionNumber[], ficha: Employee["ficha"]) => {
    const numberQueryString = number.map(item => `number=${item}`).join("&")
    await API.delete(`/api/extensions?${numberQueryString}&ficha=${ficha}`)
  }
}

export default ExtensionService;