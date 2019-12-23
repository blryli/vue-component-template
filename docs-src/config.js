export const config = require('../package.json')

export const upName = config.name.split('-').reduce((acc, cur) => acc + cur.replace(cur[0], cur[0].toUpperCase()), '')
