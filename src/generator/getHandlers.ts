import { Project } from 'ts-morph'
import path from 'path';
import { cwd } from 'process';
import { Handler } from './Handler';


export function getHandlers() {

  const project = new Project({
    tsConfigFilePath: path.join(cwd(), 'tsconfig.json'),
  })

  const compilerOptions = project.getCompilerOptions()
  const sourceFiles = project.addSourceFilesAtPaths([
    path.resolve(compilerOptions.baseUrl) + "/**/*.ts",
  ])

  const handlers: Handler[] = []

  sourceFiles.forEach(sourceFile => {
    sourceFile.getClasses().forEach(cls => {
      const className = cls.getName()
      if (!className) return

      const handler: Handler = {
        name: className[0].toLowerCase() + className.slice(1),
        methods: []
      }

      for (const method of cls.getMethods()) {
        const decorator = method.getDecorators().find(decorator => decorator.getName() == 'IpcChannel')

        if (decorator && method.isAsync()) {
          const baseUrl = compilerOptions.baseUrl + "/"

          const parameters = method.getParameters().map(param => {
            const paramName = param.getName()
            const paramType = param.getType().getText().replace(baseUrl, '')
            return `${paramName}: ${paramType}`
          }).join(', ')

          handler.methods.push({
            methodName: method.getName(),
            parameters,
            returnType: method.getReturnType().getText().replace(baseUrl, ''),
            parameters_: method.getParameters().map(param => param.getName()).join(", "),
          })
        }
      }

      handlers.push(handler)
    });
  });

  return handlers
}
