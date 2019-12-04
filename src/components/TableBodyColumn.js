export default {
  name: 'TableBodyColumn',
  props: {
    index: { type: Number, default: 0 },
    item: { type: Object, default: () => {} },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 }
  },
  inject: ['table'],
  data() {
    return {
      checked: false,
      columnId: null
    }
  },
  render(h) {
    const renderSlot = this.renderSlot(h)
    const slot = renderSlot || (this.column.type === 'selection' ? this.renderSelection(h) : this.column.type === 'index' ? this.renderIndex() : this.column.prop ? this.item[this.column.prop] : '')

    return h('div', {
      class: this.columnClass,
      style: this.table.setColumnStyle(this.column, this.columnIndex, this.width),
      on: {
        mouseenter: event => this.handleMouseenter(event, slot),
        mouseleave: event => this.handleMouseleave(event, slot)
      }
    }, [
      h('div', {
        class: { cell: true, 'v-tooltip': this.showOverflowTooltip },
        ref: 'cell'
      }, [slot])
    ])
  },
  computed: {
    width() {
      return this.column.width || (this.column.minWidth || 80) + this.table.offset
    },
    showOverflowTooltip() {
      return this.table.showOverflowTooltip || this.column.showOverflowTooltip
    },
    columnClass() {
      let classes = `v-table_${this.index + 1}_column_${this.columnIndex + 1}`
      this.column.fixed && this.table.bodyOverflowX && (classes += ` is--fixed-${this.column.fixed}`)
      this.column.className && (classes += ` ${this.column.className}`)
      return classes
    }
  },
  methods: {
    renderSelection(h) {
      return h('el-checkbox', {
        attrs: { value: this.table.isChecked(this.index), key: this.index },
        on: { change: this.selectionRowChange }
      })
    },
    handleMouseenter(event, slot) {
      const { item, column } = this
      const { cell } = this.$refs
      this.table.$emit('cell.mouse.enter', item, column, cell, event, slot)
      if (!cell.classList.contains('v-tooltip') && cell.childNodes.length) {
        return
      }
      // 如果文本溢出 显示tooltip
      const range = document.createRange()
      range.setStart(cell, 0)
      range.setEnd(cell, cell.childNodes.length)
      const rangeWidth = range.getBoundingClientRect().width
      const padding = parseInt(this.getStyle(cell, 'paddingLeft')) + parseInt(this.getStyle(cell, 'paddingRight'))
      if (padding + rangeWidth > this.width) {
        this.table.show = true
        this.table.reference = cell
        this.table.popoverSlot = slot
      }
    },
    getStyle(elem, prop) {
      if (prop) prop = prop.replace(/([A-Z])/g, str => '-' + str.toLowerCase())
      return window.getComputedStyle(elem, null).getPropertyValue(prop)
    },
    handleMouseleave(event, slot) {
      const { item, column } = this
      const { cell } = this.$refs
      this.table.$emit('cell.mouse.leave', item, column, cell, event, slot)
      this.table.show = false
    },
    renderIndex() {
      return this.index + 1
    },
    renderSlot(h) {
      return this.column.renderSlot(h, { row: this.item, $index: this.index })
    },
    selectionRowChange(selected) {
      this.table.$emit('row.selection.change', this.index, selected)
    }
  }
}
