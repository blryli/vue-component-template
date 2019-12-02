<template>
  <DynamicScroller
    ref="DynamicScroller"
    :key-field="table.keyField"
    content-tag="table"
    :items="data"
    :min-item-size="50"
    class="v-scroller"
    :style="style"
    @update="update"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
          item.message,
        ]"
        :data-index="index"
      >
        <v-table-body :item="item" :index="index" />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script>
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import VTableBody from './TableBody'
import { on, off } from '../utils/dom'

export default {
  components: {
    DynamicScroller, DynamicScrollerItem, VTableBody
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  inject: ['table'],
  computed: {
    style() {
      return {
        '--width': this.table.minWidth + 'px',
        maxHeight: parseInt(this.table.height) + 'px'
      }
    }
  },
  mounted() {
    on(this.$el, 'scroll', this.handleScroll)
    this.addEmpty()
  },
  beforeDestroy() {
    off(this.$el, 'scroll', this.handleScroll)
  },
  methods: {
    forceUpdate() {
      this.$refs.DynamicScroller.forceUpdate()
    },
    update(startIndex, endIndex) {
      // console.log(startIndex, endIndex)
    },
    handleScroll(e) {
      this.table.bodyScrollLeft = e.target.scrollLeft
    },
    addEmpty() {
      const wrapper = this.$el.querySelector('.vue-recycle-scroller__item-wrapper')
      !wrapper.offsetHeight && (wrapper.innerHTML = `<div id="empty" class="empty-text">${this.table.emptyText}</div>`)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-scroller {
  flex: 1;
  height: 100%;
  font-size: 12px;
  min-height: 30px;
}
</style>
<style>
.empty-text{
  padding: 15px 0;
  text-align: center;
  font-size: 12px;
  color: #888;
}
.vue-recycle-scroller.is--fixed::-webkit-scrollbar {
    width: 0 !important;
    height: 0!important;
}
.vue-recycle-scroller__item-wrapper {
  min-width: var(--width) !important;
}
</style>
