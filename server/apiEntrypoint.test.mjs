import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import ts from 'typescript'

test('compiled production API loads in native Node ESM without Vite or a custom import loader', (t) => {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const output = mkdtempSync(join(tmpdir(), 'hood-api-entry-'))
  t.after(() => rmSync(output, { recursive: true, force: true }))
  const program = ts.createProgram([join(root, 'api/portfolio-assistant.ts')], {
    rootDir: root,
    outDir: output,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    types: ['node'],
    strict: true,
    skipLibCheck: true,
    noEmitOnError: true,
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n',
    }),
  )
  assert.equal(program.emit().emitSkipped, false)
  writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }))

  // A separate Node process exercises real emitted imports, including the data
  // re-export chain. No provider key or network call is needed for this check.
  const entry = pathToFileURL(join(output, 'api/portfolio-assistant.js')).href
  const script = `
    import assert from 'node:assert/strict';
    const { default: api } = await import(${JSON.stringify(entry)});
    const url = 'https://portfolio.example/api/portfolio-assistant';
    assert.equal((await api.fetch(new Request(url))).status, 405);
    const post = (query) => new Request(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    assert.equal((await api.fetch(post(''))).status, 400);
    const unavailable = await api.fetch(post('Tell me about GALE'));
    assert.equal(unavailable.status, 503);
    assert.deepEqual(await unavailable.json(), { error: 'assistant_unavailable' });
  `
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: output,
    env: { ...process.env, GEMINI_API_KEY: '' },
    encoding: 'utf8',
    timeout: 15000,
  })
  assert.equal(result.status, 0, result.error?.message || result.stderr || result.stdout)
})
