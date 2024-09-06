export const saveToSStorage = <T = unknown,>(name: string, value: T) => {
  sessionStorage.setItem(name, JSON.stringify(value))
}

export const getFromSStorage = <T,>(name: string): (T | null) => {
  return JSON.parse(sessionStorage.getItem(name) as string)
}