import { resolve } from 'path'

import type { PackageOptions } from 'siroc'

import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const components = ['sanity-content', 'sanity-image']
const externals = ['chalk', 'consola', 'defu', 'fs-extra']

const config: PackageOptions = {
  rollup: {
    externals,
  },
  hooks: {
    'build:extendRollup' (_pkg, { rollupConfig }) {
      components.forEach((base) => {
        rollupConfig.push({
          input: resolve(__dirname, `./src/components/${base}.ts`),
          output: {
            file: resolve(__dirname, `./dist/${base}.js`),
            format: 'cjs',
          },
          external: externals,
          plugins: [
            esbuild(),
          ],
        })
        rollupConfig.push({
          input: resolve(__dirname, `./src/components/${base}.ts`),
          output: {
            file: resolve(__dirname, `./dist/${base}.d.ts`),
            format: 'es',
          },
          external: externals,
          plugins: [
            dts(),
          ],
        })
      })
    },
  },
}

export default config
