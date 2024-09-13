import { Department } from "@/pages/api/_schemas/department.schema"
import { EmployeeExtension } from "@/pages/api/_schemas/extension.schema"
import React from "react"

export type PDFProps = {
  extensions: EmployeeExtension[]
  departments: Department[]
}

export type PDFRenderType = ({ extensions, departments }: PDFProps) => React.JSX.Element