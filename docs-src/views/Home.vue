<template>
  <div class="home">
    <el-form inline>
      <el-form-item label="文本溢出启用tooltip">
        <el-switch v-model="showOverflowTooltip" />
      </el-form-item>
    </el-form>

    <v-table
      v-if="update"
      ref="table"
      height="400"
      key-field="gNo"
      :data="data"
      :show-overflow-tooltip="showOverflowTooltip"
      highlight-current-row
      @selection-change="selectionChange"
      @row-click="rowClick"
    >
      <v-table-column v-if="checked" key="checkbox" fixed="left" type="selection" :width="40" />
      <v-table-column v-else key="radio" :width="40" fixed="left">
        <template slot-scope="scope">
          <el-radio v-model="radio" class="radio" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </v-table-column>
      <v-table-column type="index" :min-width="60" fixed="left" label="序号">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </v-table-column>
      <v-table-column label="标题1" prop="asn" :min-width="100" />
      <v-table-column label="标题2" :min-width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </v-table-column>
      <v-table-column label="标题3" prop="city" :min-width="100" />
      <v-table-column label="标题4" :min-width="150">
        <template slot-scope="scope">{{ scope.row.datetime }}</template>
      </v-table-column>
      <v-table-column label="标题5" prop="datetime" :min-width="150" />
      <v-table-column label="标题6" prop="name" :min-width="150" />
      <v-table-column label="标题7" :min-width="120">
        <template slot-scope="scope">{{ scope.row.message }}</template>
      </v-table-column>
      <v-table-column v-for="(d, i) in forData" :key="i" :label="d.label" :min-width="150" :render-header="renderHeader">
        <template slot-scope="scope">{{ scope.row[d.prop] }}</template>
      </v-table-column>
      <v-table-column label="操作" fixed="right" :min-width="100">
        <template>
          <el-button type="text" icon="el-icon-edit" />
          <el-button type="text" icon="el-icon-delete" />
        </template>
      </v-table-column>
    </v-table>
    <div class="handle">
      <el-button @click="checked = !checked">{{ `切换为${checked ? '单选' : '多选'}` }}</el-button>
      <el-button @click="toggleRowSelection">选中第二项</el-button>
      <el-button @click="toggleAllSelection">切换全选</el-button>
    </div>
  </div>
</template>

<script>
import mock from 'mockjs'

export default {
  linkName: '主页',
  data() {
    return {
      radio: null,
      checked: true,
      data: [],
      forData: [
        { prop: 'city', label: '标题' },
        { prop: 'name', label: '标题' },
        { prop: 'message', label: '标题' }
      ],
      update: true,
      showOverflowTooltip: true
    }
  },
  watch: {
    showOverflowTooltip() {
      this.update = false
      this.$nextTick(() => {
        this.update = true
      })
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|1000': [
          {
            'message': '@email',
            'name': '@cname',
            'email': '@email',
            'city': '@city',
            'datetime': '@datetime',
            'asn': /asn10000[1-9]/,
            'gNo|+1': 1
          }
        ]
      }).array
      console.log(this.data)
    }, 500)
  },
  methods: {
    renderHeader(h, { column, $index }) {
      return h('div', {}, [column.label, $index - 1])
    },
    selectionChange(val) {
      console.log(val)
      // console.log(`selection change > ${JSON.stringify(val, null, 2)}`)
    },
    rowClick(row, index, event) {
      console.log(`click row > ${JSON.stringify(row, null, 2)}`)
    },
    toggleRowSelection() {
      this.$refs.table.toggleRowSelection(this.data[1])
    },
    toggleAllSelection() {
      this.$refs.table.toggleAllSelection()
    }
  }
}
</script>

<style>
.home{
  padding: 20px 40px;
}
.v-table .cell .el-radio__label{
  display: none;
}
.handle{
  margin-top: 20px;
}
</style>
