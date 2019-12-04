<template>
  <div :class="tableClass">
    <div ref="VHiddenColumns" class="v-hidden-columns">
      <slot />
    </div>
    <!-- header -->
    <div class="v-table__header-wrapper">
      <v-table-header ref="TableHeader" />
      <div v-show="bodyOverflowY" class="v-table__header-gutter"></div>
    </div>
    <!-- body -->
    <div class="v-table__body-wrapper">
      <DynamicScroller ref="DynamicScroller" :data="data" />
      <!-- 左侧 fixed 投影 -->
      <div v-show="bodyOverflowX && bodyScrollLeft" class="v-table__shadow-left" :style="{left: `${leftWidth - 2}px`}" />
      <!-- 右侧 fixed 投影 -->
      <div v-show="bodyOverflowX && rightWidth && !isScrollRightEnd" class="v-table__shadow-right" :style="{right: `${rightWidth + scrollYwidth}px`}" />
      <!-- 气泡 -->
      <Popover :show="show" :reference="reference" :content="popoverSlot" />
    </div>
  </div>
</template>

<script>
import VTableHeader from './TableHeader'
import DynamicScroller from './DynamicScroller'
import Column from './column'
import Selection from './selection'
import Layout from './layout'
import Popover from './Popover'

export default {
  name: 'VTable',
  components: {
    VTableHeader,
    DynamicScroller,
    Popover
  },
  mixins: [Column, Layout, Selection],
  props: {
    data: { type: Array, default: () => [] },
    height: { type: [String, Number], default: 400 },
    highlightCurrentRow: { type: Boolean, default: false },
    border: { type: Boolean, default: false },
    keyField: { type: String, default: '' },
    emptyText: { type: String, default: '暂无数据' },
    showOverflowTooltip: { type: Boolean, default: false }
  },
  data() {
    return {
      show: false,
      popoverSlot: null,
      reference: null,
      currentRow: null
    }
  },
  watch: {
    data(val) {
      if (this.data.length) {
        if (!this.keyField) {
          console.error('v-table 必须设置 keyField 字段，且必须是 item 内具有唯一值的字段')
        } else {
          const values = this.data.map(d => d[this.keyField])
          this.data.length !== [...new Set(values)].length && console.error(`data数据 item 的 ${this.keyField} 字段的值必须是唯一的`)
        }
      }
    }
  },
  provide() {
    return {
      table: this
    }
  },
  methods: {
    forceUpdate() {
      this.$refs.DynamicScroller.forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-table {
  font-size: 14px;
  position: relative;
  color: #606266;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
.v-hidden-columns {
  visibility: hidden;
  position: absolute;
  z-index: -1;
}
.nodata {
  font-size: 12px;
  line-height: 40px;
  text-align: center;
  color: #666;
}
.v-table__shadow-left, .v-table__shadow-right{
  position: absolute;
  top: 0;
  bottom: 17px;
  width: 1px;
}
.v-table__shadow-left{
  box-shadow: 5px 0px 8px rgba(0, 0, 0, 0.5);
}
.v-table__shadow-right{
  box-shadow: -5px 0px 8px rgba(0, 0, 0, 0.5);
}
</style>

<style>
.v-table .cell{
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
}

.v-table .cell.v-tooltip {
    white-space: nowrap;
    min-width: 50px;
}

/** header */
.v-table__header-wrapper{
  position: relative;
}
.v-table__header-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}
.v-table__header-gutter{
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 17px;
  box-sizing: border-box;
}
.is-border .v-table__header-gutter{
  border-left: 1px solid #ddd;
}
.v-table__header-container::-webkit-scrollbar {
  height: 0 !important;
}
.is-overflow-y .v-table__header-container{
  overflow-y: scroll;
}
.v-table__header, .v-table__body {
  position: relative;
  width: 100%;
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
}
.v-table__body.current-row [class*='_column_'] {
    background-color: #e8f4ff;
}
.v-table__body:hover [class*='_column_']{
  background-color: #f1f3f5;
}
.v-table__header [class*='_column_'], .v-table__body [class*='_column_']{
  display: flex;
  align-items: center;
  padding: 8px 0;
  background-color: #fff;
  box-sizing: border-box;
}

.v-table__body [class*='_column_']{
  border-bottom: 1px solid #ddd;
}

.v-table__header [class*='_column_'] {
  font-weight: bold;
  color: #888;
  user-select: none;
}
.is-border .v-table__header [class*='_column_'] + [class*='_column_'],
.is-border .v-table__body [class*='_column_'] + [class*='_column_']{
  border-left: 1px solid #ddd;
}
[class*=is--fixed-] {
  position: absolute;
  top: 0;
  bottom: 0;
}
</style>
