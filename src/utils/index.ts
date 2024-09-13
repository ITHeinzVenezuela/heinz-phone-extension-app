import { Department } from "@/pages/api/_schemas/department.schema";
import { EmployeeExtension } from "@/pages/api/_schemas/extension.schema";

export const sortDepartments = (departments: Department[]) => {
  return departments.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  })
}

export const sortByDepAlphabetically = (extensions: EmployeeExtension[]) => {
  return extensions.sort((a, b) => {
    const nameA = a.department.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.department.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  })
}

export const formatExtensions = (extensions: EmployeeExtension[]) => {
  return extensions.map(({ employee, ...rest }) => {
    const name = employee.name.split(", ")

    const formatName = (word: string) => {
      const array = word.split("")
      const firstLetter = array[0].toUpperCase()
      const rest = array.slice(1, array.length).join("").toLowerCase()
      return `${firstLetter}${rest}`
    }

    debugger

    let firstName = name.join("")
    let lastName = ""

    if (name.length === 2) {
      firstName = formatName(name[1].split(" ")[0])
      lastName = formatName(name[0].split(" ")[0])
    }

    return ({
      ...rest,
      employee: {
        ...employee,
        name: `${firstName} ${lastName}`
      }
    })
  })
}