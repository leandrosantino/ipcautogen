import { Method } from "./Handler"

export function methodTemplate(method: Method) {
  return `
    ${method.methodName}: async (${method.parameters}):${method.returnType} => {
      return await ipcRenderer.invoke('${method.methodName}', ${method.parameters_})
    },
  `
}

export function handlerTemplate(name: string, methods: string) {
  return `
  ${name}: {
    ${methods}
  },
  `
}

export function scriptTemplate(handlers: string) {
  return `
import { ipcRenderer } from "electron"
export default {
  ${handlers}
}
  `
}
