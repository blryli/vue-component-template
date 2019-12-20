const routerFiles = require.context('./', false, /\.vue$/)

let routes = routerFiles.keys().reduce((acc, filePath) => {
  const view = routerFiles(filePath).default
  const { name, linkName, order = 0 } = view
  return acc.concat({ path: `/${name}`, name, linkName: linkName || name, order, component: () => import(`${filePath}`) })
}, []).sort((cur, next) => cur.order - next.order)

routes = routes.concat([
  { path: '/', redirect: '/home' },
  { path: '*', redirect: '/' }
])

console.log('routes:', JSON.stringify(routes, null, 2))

export default routes
