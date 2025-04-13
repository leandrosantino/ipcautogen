import { compiler } from "./compiler"
import { getHandlers } from "./getHandlers"
import { methodTemplate, handlerTemplate, scriptTemplate } from "./templates"

export function generateHandlers() {
  const handlers = getHandlers()

  const strHandler = handlers.map(handler => {
    const strMethods = handler.methods.map(methodTemplate).join('')
    return handlerTemplate(handler.name, strMethods)
  }).join('')

  const script = scriptTemplate(strHandler)

  try {
    compiler(script)
    console.log("Handlers generated successfully.")
  } catch (e) {
    console.error("Error generating functions")
  }
}



