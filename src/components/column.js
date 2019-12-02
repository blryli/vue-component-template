export default {
  data() {
    return {
      leftWidth: 0,
      rightWidth: 0,
      columns: [],
      columnsWidth: [],
      columnCalcWidthLenght: 0
    }
  },
  created() {
    this.$on('insert.column', this.insertColumn)
    this.$on('remove.column', this.removeColumn)
  },
  computed: {
    columnsSort() {
      return this.columns.filter(d => d.fixed === 'left').concat(this.columns.filter(d => d.fixed !== 'left' && d.fixed !== 'right')).concat(this.columns.filter(d => d.fixed === 'right'))
    }
  },
  methods: {
    // 插入列
    insertColumn(column) {
      // console.log(column)
      const { width, minWidth } = column
      const columnWidth = width || minWidth || 80
      !width && this.columnCalcWidthLenght++
      if (column.fixed) {
        this[`${column.fixed}Width`] += columnWidth
      }
      const columnIndex = this.$slots.default.filter(d => d.tag).findIndex(d => JSON.stringify(column) === JSON.stringify(d.componentInstance.columnConfig))
      column.columnId = columnIndex + 1
      this.columns.splice(columnIndex, 0, column)
      this.columnsWidth.splice(columnIndex, 0, columnWidth)
    },
    // 移除列
    removeColumn(column) {
      const index = this.columns.findIndex(d => d.columnId === column.columnId)
      if (index !== -1) {
        const { width, minWidth } = column
        const columnWidth = width || minWidth || 80
        !width && this.columnCalcWidthLenght--
        if (column.fixed) {
          this[`${column.fixed}Width`] -= columnWidth
        }
        this.columns.splice(index, 1)
        this.columnsWidth.splice(index, 1)
      }
    },
    setColumnStyle(column, columnIndex, width) {
      const style = {}
      style.width = width + 'px'

      // 如果有横向滚动条 设置左右定位元素的位置
      if (this.bodyOverflowX) {
        column.fixed === 'left' && (style.left = (columnIndex ? this.columnsWidth[columnIndex - 1] : 0) + this.bodyScrollLeft + 'px')

        if (!this.isScrollRightEnd) {
          const firstRightFixedIndex = this.columnsSort.findIndex(d => d.fixed === 'right')
          columnIndex === firstRightFixedIndex && (style.borderLeftColor = 'transparent')
        }

        column.fixed === 'right' && (style.right = (columnIndex !== this.columnsWidth.length - 1 ? this.columnsWidth[columnIndex + 1] : 0) + (this.width - this.bodyWidth) - this.bodyScrollLeft + this.scrollYwidth + 2 + 'px')
      }
      return style
    }
  },
  beforeDestroy() {
    this.$off('insert.column', this.headerColumn)
    this.$off('remove.column', this.removeColumn)
  }
}
