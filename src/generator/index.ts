import { compiler } from "./compiler"
import { getHandlers } from "./getHandlers"
import { Method } from "./Handler"
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
    console.log("Functions generated successfully.")
  } catch (e) {
    console.error("Error generating functions:", e.message)
  }
}



