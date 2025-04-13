import ts from 'typescript'
import path from 'path'
import fs from 'fs'

export function compiler(tsCode: string) {
  // Resolve o caminho real do seu módulo dentro do projeto
  let moduleRoot = ""
  try {
    moduleRoot = path.join(path.dirname(require.resolve('ipcautogen')), '..')
  } catch {
    moduleRoot = path.resolve(__dirname, '..')
  }

  const outputDir = path.join(moduleRoot, 'generated')
  const fileName = 'handlers.ts'
  const filePath = path.join(outputDir, fileName)

  // Código em string (gerado com ts-morph ou outra coisa)

  // 1. Escreve temporariamente no disco
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(filePath, tsCode)

  // 2. Configura e compila com a API do TS
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

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file && diagnostic.start !== undefined) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    } else {
      console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })

  if (emitResult.emitSkipped) {
    console.error('Falha ao compilar o código.')
    process.exit(1)
  }

  // 3. (Opcional) Remove o .ts temporário
  fs.unlinkSync(filePath)
}
