import axios from "axios";

const MINUTE = 60 * 1000
const PORT = process.env.PORT || ""
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || ""

const API = axios.create({
  baseURL,
  timeout: .5 * MINUTE,
  headers: {"Content-Type": "application/json"}
})

export default API;