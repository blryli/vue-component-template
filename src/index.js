import Table from './components/index.vue'
import TableColumn from './components/TableColumn'

const components = [Table, TableColumn]

export {
  Table,
  TableColumn
}

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
