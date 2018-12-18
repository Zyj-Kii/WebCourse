<template>
    <div>
        <template v-if="sourceData">
            <el-table stripe :data="sourceData">
                <el-table-column
                    v-for="(item, key) of tableColumn"
                    :key="key"
                    :label="item"
                    :prop="item"
                    align="center"
                ></el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
export default {
  name: 'studentSource',
  data () {
    return {
      tableColumn: null,
      sourceData: null
    }
  },
  activated () {
    this.$get('/admin/studentCollege/getCollegeStudentFrom')
      .then(res => {
        if (res.code === 2000) {
          const data = res.dataMap
          const basicData = {}
          const tableColumn = []
          for (let i in data) {
            if (tableColumn.indexOf('学院') === -1) {
              tableColumn.push('学院')
            }
            for (let item of data[i]) {
              basicData[item.studentFrom] = 0
              if (tableColumn.indexOf(item.studentFrom) === -1) {
                tableColumn.push(item.studentFrom)
              }
            }
          }
          this.tableColumn = tableColumn
          const mySourceData = []
          for (let i in data) {
            const innerData = Object.assign({}, basicData)
            innerData['学院'] = i
            for (let item of data[i]) {
              innerData[item.studentFrom] = item.sum
            }
            mySourceData.push(innerData)
          }
          this.sourceData = mySourceData
        } else {
          this.$errorNotify(res.message)
        }
      })
      .catch(() => {
        this.$errorNotify('获取生源地失败')
      })
  }
}
</script>

<style scoped>

</style>
