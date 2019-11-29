const routerFiles = require.context('./', false, /\.vue$/)

let routes = routerFiles.keys().reduce((acc, filePath) => {
  const pathArr = filePath.split('/')
  const name = pathArr[pathArr.length - 1].replace('.vue', '')
  const path = '/' + name.toLowerCase()
  const { order = 0 } = routerFiles(filePath).default
  return acc.concat({ path, name, order, component: () => import(`${filePath}`) })
}, []).sort((cur, next) => cur.order - next.order)

const home = '' || routes[0].path

routes = routes.concat([
  { path: '/', redirect: home },
  { path: '*', redirect: '/' }
])

console.log('routes:', JSON.stringify(routes, null, 2))

export default routes
