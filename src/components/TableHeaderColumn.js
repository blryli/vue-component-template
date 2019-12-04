export default {
  name: 'VTableHeaderColumn',
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 }
  },
  inject: ['table'],
  computed: {
    width() {
      return this.column.width || (this.column.minWidth || 80) + this.table.offset
    },
    columnClass() {
      let classes = `v-table_1_column_${this.columnIndex + 1}`
      this.column.fixed && this.table.bodyOverflowX && (classes += ` is--fixed-${this.column.fixed}`)
      this.column.labelClassName && (classes += ` ${this.column.labelClassName}`)
      return classes
    }
  },
  render(h) {
    const { column, columnIndex: $index } = this
    const slot = this.column.renderHeader(h, { column, $index }) || this.column.header || (this.column.type === 'selection' ? this.renderSelection(h) : this.column.type === 'index' ? (this.column.label || '#') : this.column.label)

    return h('div', {
      class: this.columnClass,
      style: this.table.setColumnStyle(this.column, this.columnIndex, this.width)
    }, [
      h('div', { class: 'cell' }, [slot])
    ])
  },
  methods: {
    renderSelection(h) {
      return h('el-checkbox', {
        attrs: {
          value: this.table.selectionAll,
          key: this.index,
          indeterminate: this.table.indeterminate
        },
        on: { change: this.selectionChange }
      })
    },
    selectionChange(val) {
      this.table.$emit('all.selection.change', val)
    }
  }
}
