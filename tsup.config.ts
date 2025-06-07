import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  outDir: 'build',
  noExternal: ['@/*'],
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.js']
    options.alias = {
      '@': './src',
    }
    options.platform = 'node'
    options.target = 'node18'
  },
})
