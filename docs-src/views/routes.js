const routerFiles = require.context('./', false, /\.vue$/)

let routes = routerFiles.keys().reduce((acc, filePath) => {
  const path = '/' + filePath.replace(/.\/|.vue/g, '')
  const view = routerFiles(filePath).default
  const { linkName = path.replace('/', ''), order = 0 } = view
  return acc.concat({ path, linkName, order, component: () => import(`${filePath}`) })
}, []).sort((cur, next) => cur.order - next.order)

routes = routes.concat([
  { path: '/', redirect: '/home' },
  { path: '*', redirect: '/' }
])

console.log('routes:', JSON.stringify(routes, null, 2))

export default routes
