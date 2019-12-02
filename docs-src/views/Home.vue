<template>
  <div class="home">
    <v-table
      ref="table"
      height="400"
      key-field="gNo"
      :data="data"
      show-overflow-tooltip
      highlight-current-row
      @selection-change="selectionChange"
      @row-click="rowClick"
      @row-dblclick="rowDblClick"
    >
      <v-table-column v-if="checked" key="checkbox" fixed="left" type="selection" :width="40" />
      <v-table-column v-else key="radio" :width="60" fixed="left">
        <template slot-scope="scope">
          <el-radio v-model="radio" class="radio" style="padding: 6px" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </v-table-column>
      <v-table-column type="index" :min-width="60" fixed="left" label="序号" />
      <v-table-column label="标题1" prop="asn" :min-width="100" />
      <v-table-column label="标题2" :min-width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </v-table-column>
      <v-table-column label="标题3" prop="asn" :min-width="100" />
      <v-table-column label="标题4" show-overflow-tooltip :min-width="150">
        <template>溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字</template>
      </v-table-column>
      <v-table-column label="标题5" prop="asn" :min-width="150" />
      <v-table-column label="标题6" prop="name" :min-width="150" />
      <v-table-column label="标题1" prop="asn" :min-width="100" />
      <v-table-column label="标题2" :min-width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </v-table-column>
      <v-table-column label="标题3" prop="asn" :min-width="100" />
      <v-table-column label="标题4" show-overflow-tooltip :min-width="150">
        <template>溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字</template>
      </v-table-column>
      <v-table-column label="标题5" prop="asn" :min-width="150" />
      <v-table-column label="标题6" prop="name" :min-width="150" />
      <v-table-column label="标题1" prop="asn" :min-width="100" />
      <v-table-column label="标题2" :min-width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </v-table-column>
      <v-table-column label="标题3" prop="asn" :min-width="100" />
      <v-table-column label="标题4" show-overflow-tooltip :min-width="150">
        <template>溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字溢出文字</template>
      </v-table-column>
      <v-table-column label="标题5" prop="asn" :min-width="150" />
      <v-table-column label="标题6" prop="name" :min-width="150" />
      <v-table-column label="标题7" :min-width="150">
        <template slot-scope="scope">{{ scope.row.message }}</template>
      </v-table-column>
      <v-table-column label="操作" :min-width="100">
        <template>
          <el-button type="text" icon="el-icon-edit" />
          <el-button type="text" icon="el-icon-delete" />
        </template>
      </v-table-column>
    </v-table>
    <p>
      <el-button type="primary" @click="checked = !checked">{{ `切换为${checked ? '单选' : '多选'}` }}</el-button>
      <el-button type="primary" @click="toggleRowSelection">选中第二项</el-button>
      <el-button type="primary" @click="toggleAllSelection">切换全选</el-button>
    </p>
  </div>
</template>

<script>
import mock from 'mockjs'

export default {
  name: 'Home',
  data() {
    return {
      radio: null,
      checked: true,
      data: []
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|1000': [
          {
            'message': '@name',
            'name': '@name',
            'asn': /asn10000[1-9]/,
            'gNo|+1': 1,
            'contrItem': '5',
            'codeTs': '8516605000'
          }
        ]
      }).array
      console.log(this.data)
    }, 1000)
  },
  methods: {
    change() {},
    selectionChange(val) {
      console.log(val)
      // console.log(`selection change > ${JSON.stringify(val, null, 2)}`)
    },
    rowClick(row, index, event) {
      console.log(`click row > ${JSON.stringify(row, null, 2)}`)
    },
    rowDblClick(row, index, event) {
      console.log(`dbclick row > ${JSON.stringify(row, null, 2)}`)
    },
    toggleRowSelection() {
      this.$refs.table.toggleRowSelection(this.data[1])
    },
    toggleAllSelection() {
      this.$refs.table.toggleAllSelection()
    },
    cellMouseEnter(row, column, cell, event) {
      console.log(row)
      console.log(column)
      console.log(cell)
      console.log(event)
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
</style>
