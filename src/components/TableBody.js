import TableBodyColumn from './TableBodyColumn'
import { getCell, getColumnByCell } from '../utils'

export default {
  name: 'TableBody',
  components: { TableBodyColumn },
  props: {
    item: { type: Object, default: () => {} },
    index: Number
  },
  inject: ['table'],
  render(h) {
    const slots = this.table.columnsSort.reduce((acc, column, columnIndex) => {
      const { item, index } = this
      const slot = h('TableBodyColumn', { attrs: { item, index, column, columnIndex }})
      return acc.concat([slot])
    }, [])
    let classes = 'v-table__body'
    this.table.currentRow === this.index && (classes += ' current-row')

    return h('div', {
      class: classes,
      style: this.table.rowStyle,
      on: {
        click: event => this.handleClick(event),
        dblclick: event => this.handleDoubleClick(event)
      }
    }, [slots])
  },
  methods: {
    handleClick(event) {
      this.table.highlightCurrentRow && (this.table.currentRow = this.index)
      this.handleEvent(event, 'click')
    },
    handleDoubleClick(event) {
      this.handleEvent(event, 'dblclick')
    },
    handleEvent(event, name) {
      const table = this.table
      const cell = getCell(event)
      let column
      if (cell) {
        column = getColumnByCell(table, cell)
        if (column) {
          table.$emit(`cell-${name}`, this.item, column, cell, event)
        }
      }
      table.$emit(`row-${name}`, this.item, column, event)
    }
  }
}
