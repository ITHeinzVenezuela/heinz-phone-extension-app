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

  create = async (extension: Extension) => {
    const { data } = await API.post<Extension>(`/api/extensions`, extension)
    return data;
  }

  update = async (number: ExtensionNumber, extension: Extension) => {
    const { data } = await API.put<Extension>(`/api/extensions?number=${number}`, extension)
    return data;
  }

  delete = async (number: ExtensionNumber, ficha: Employee["ficha"]) => {
    await API.delete(`/api/extensions?number=${number}&ficha=${ficha}`)
  }
}

export default ExtensionService;