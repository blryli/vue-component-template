export default {
  name: 'VTableColumn',
  props: {
    type: String,
    width: { type: Number, default: 0 },
    renderHeader: { type: Function, default: () => {} },
    minWidth: { type: Number, default: 0 },
    label: { type: String, default: '' },
    prop: { type: String, default: '' },
    fixed: { type: String, default: '' },
    className: { type: String, default: '' },
    labelClassName: { type: String, default: '' },
    showOverflowTooltip: { type: Boolean, default: false }
  },
  data() {
    return {
      columnConfig: null
    }
  },
  inject: ['table'],
  mounted() {
    const { header } = this.$slots
    const { renderSlot } = this
    this.columnConfig = Object.keys(this.$options.props).reduce((acc, cur) => {
      this.$watch(cur, (newVal) => {
        this.columnConfig[cur] = newVal
      })
      acc[cur] = this[cur]
      return acc
    }, { header, renderSlot })
    this.table.$emit('insert.column', this.columnConfig)
  },
  destroyed() {
    this.table.$emit('remove.column', this.columnConfig)
  },
  methods: {
    renderSlot(h, data) {
      return this.$scopedSlots.default ? this.$scopedSlots.default(data)
        : this.$slots.default ? this.$slots.default[0] : false
    }
  },
  render(h) {
    return h('div', {}, [])
  }
}
