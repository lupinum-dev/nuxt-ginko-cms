#!/usr/bin/env node
/**
 * CLI entry point for cms-nuxt commands
 * Uses tsx to run TypeScript files directly
 */

import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const command = args[0]

if (command === 'generate-types') {
  // Run the TypeScript CLI with tsx
  const cliPath = join(__dirname, '..', 'src', 'cli', 'generate-types.ts')
  const cliArgs = args.slice(1)

  const child = spawn('npx', ['tsx', cliPath, ...cliArgs], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
  })

  child.on('exit', (code) => {
    process.exit(code ?? 0)
  })
}
else {
  console.log(`
@lupinum/cms-nuxt CLI

Commands:
  generate-types    Generate TypeScript types from CMS schema

Options:
  --help, -h        Show help

Examples:
  npx cms-nuxt generate-types
  npx cms-nuxt generate-types --output ./types/cms.ts
`)

  if (command && command !== '--help' && command !== '-h') {
    console.error(`Unknown command: ${command}`)
    process.exit(1)
  }
}
