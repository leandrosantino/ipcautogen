import ts from 'typescript'
import path from 'path'
import fs from 'fs'

export function compiler(tsCode: string) {
  let moduleRoot = ""
  try {
    moduleRoot = path.join(path.dirname(require.resolve('ipcautogen')), '..')
  } catch {
    moduleRoot = path.resolve(__dirname, '../../')
  }

  const outputDir = path.join(moduleRoot, 'handlers')
  const fileName = 'index.ts'
  const filePath = path.join(outputDir, fileName)

  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(filePath, tsCode)

  const compilerOptions: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    declaration: true,
    outDir: outputDir,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
  }

  const program = ts.createProgram([filePath], compilerOptions)
  const emitResult = program.emit()

  if (emitResult.emitSkipped) {
    throw new Error()
  }

  fs.unlinkSync(filePath)
}
