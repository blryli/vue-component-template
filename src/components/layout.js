import { on, off } from '../utils/dom'
export default {
  data() {
    return {
      leftWidth: 0,
      rightWidth: 0,
      columns: [],
      columnsWidth: [],
      columnCalcWidthLenght: 0,
      width: 0,
      bodyWidth: 0,
      offset: 0,
      bodyOverflowX: false,
      bodyOverflowY: false,
      bodyScrollLeft: 0
    }
  },
  created() {
    on(window, 'resize', this.resize, { passive: true })
  },
  watch: {
    data(val) {
      this.forceUpdate()
      this.resize()
    }
  },
  computed: {
    tableClass() {
      let tClass = 'v-table'
      this.bodyOverflowX && (tClass += ' is-overflow-x')
      this.bodyOverflowY && (tClass += ' is-overflow-y')
      this.border && (tClass += ' is-border')
      return tClass
    },
    rowStyle() {
      const style = {}
      style.width = this.width + 'px'
      const { leftWidth, rightWidth } = this
      if (this.bodyOverflowX) {
        leftWidth && (style.paddingLeft = `${leftWidth + this.offset}px`)
        rightWidth && (style.paddingRight = `${rightWidth + this.offset}px`)
      }
      return style
    },
    scrollYwidth() {
      return this.bodyOverflowY ? 17 : 0
    },
    isScrollRightEnd() {
      return this.bodyWidth + this.bodyScrollLeft > this.width + this.scrollYwidth
    },
    minWidth() {
      return this.columnsWidth.reduce((acc, cur) => acc + cur, 0)
    }
  },
  methods: {
    resize() {
      this.bodyWidth = this.$el.getBoundingClientRect().width
      this.width = this.bodyWidth > this.minWidth ? this.bodyWidth : this.minWidth
      const floor = num => Math.floor(num * 10000) / 10000
      this.offset = this.bodyWidth > this.minWidth ? floor((this.bodyWidth - this.minWidth) / this.columnCalcWidthLenght) : 0
      this.bodyHeightChange()
    },
    bodyHeightChange() {
      this.$nextTick(() => {
        const body = this.$el.querySelector('.vue-recycle-scroller')
        const { scrollHeight, clientHeight } = body
        this.bodyOverflowY = scrollHeight > clientHeight
      })
    }
  },
  mounted() {
    this.resize()
  },
  beforeDestroy() {
    off(window, 'resize', this.resize, { passive: true })
  }
}
