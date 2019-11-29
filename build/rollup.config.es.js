import base, { name, file } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name,
    file: file('esm'),
    format: 'es'
  },
  external: []
})

export default config
