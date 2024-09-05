import API from "./api"

class EmployeesService {
  getAll = async () => {
    const { data } = await API.get("/api/employees")
    return data;
  }
  findOne = async () => {
    const { data } = await API.get("/api/employees?ficha=")
    return data;
  }
}