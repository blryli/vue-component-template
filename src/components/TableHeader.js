import VTableHeaderColumn from './TableHeaderColumn'

export default {
  name: 'VTableHeader',
  components: { VTableHeaderColumn },
  inject: ['table'],
  watch: {
    'table.bodyScrollLeft'(val) {
      this.$el.scrollLeft = val
    }
  },
  render(h) {
    const slots = this.table.columnsSort.reduce((acc, column, columnIndex) => {
      const slot = h('VTableHeaderColumn', { attrs: { column, columnIndex: columnIndex }})
      return acc.concat([slot])
    }, [])
    return h('div', { class: 'v-table__header-container', ref: 'headerWrapper' }, [
      h('div', {
        class: 'v-table__header',
        style: this.table.rowStyle,
        ref: 'header'
      }, [slots])
    ])
  },
  mounted() {
    this.$nextTick(() => {
      const headerWrapper = this.$refs.headerWrapper
      const header = this.$refs.header
      const headerWrapperWidth = headerWrapper.getBoundingClientRect().width
      const headerWidth = header.getBoundingClientRect().width
      this.table.bodyOverflowX = headerWidth > headerWrapperWidth
    })
  }
}
