import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname, extname } from 'node:path'
import ts from 'typescript'

// Compile test subjects with the project's existing TypeScript and React dependencies.
const cache = new Map()
export function moduleUrl(input) {
  const path = input instanceof URL ? fileURLToPath(input) : input
  if (cache.has(path)) return cache.get(path)
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  const linked = compiled.replace(
    /^((?:import|export)[^\n'"]*?\sfrom\s*['"])([^'"]+)(['"])/gm,
    (_, prefix, relative, suffix) => {
      if (!relative.startsWith('.')) return `${prefix}${import.meta.resolve(relative)}${suffix}`
      const base = resolve(dirname(path), relative)
      const target = extname(relative)
        ? base
        : existsSync(`${base}.ts`)
          ? `${base}.ts`
          : `${base}.tsx`
      return `${prefix}${moduleUrl(target)}${suffix}`
    },
  )
  const url = `data:text/javascript;base64,${Buffer.from(linked).toString('base64')}`
  cache.set(path, url)
  return url
}
