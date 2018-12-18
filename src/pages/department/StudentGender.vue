<template>
    <div>
        <template v-if="genderData">
            <el-table :data="genderData" stripe>
                <el-table-column
                    v-for="(item, key) of genderColumn"
                    :key="key"
                    :label="item.label"
                    :prop="item.prop"
                    align="center"
                ></el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
export default {
  name: 'StudentGender',
  data () {
    return {
      genderData: null,
      genderColumn: [
        {
          label: '学院名称',
          prop: 'collegeName'
        },
        {
          label: '男性',
          prop: 'm'
        },
        {
          label: '女性',
          prop: 'f'
        }
      ]
    }
  },
  activated () {
    this.$get('/admin/studentCollege/getCollegeStudentGender')
      .then(res => {
        if (res.code === 2000) {
          const myData = []
          const data = res.dataMap
          for (let i in data) {
            const innerData = {}
            innerData.collegeName = i
            for (let item of data[i]) {
              innerData[item.studentGender] = item.sum
            }
            innerData.f = innerData.f ? innerData.f : 0
            innerData.m = innerData.m ? innerData.m : 0
            myData.push(innerData)
          }
          console.log(myData)
          this.genderData = myData
        }
      })
  }
}
</script>

<style lang="stylus" scoped>
</style>
