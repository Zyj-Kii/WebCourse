<template>
    <div>
        <el-button @click="handleAddCourse" class="addCourse" type="primary">添加课程</el-button>
        <template v-if="courseList">
            <el-table
                :data="courseList"
                stripe>
                <el-table-column
                    v-for="(item, key) of courseColumnList"
                    :key="key"
                    :label="item.label"
                    :prop="item.prop"></el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            @click="callEdit(scope.$index)"
                            size="small"
                            type="primary"
                            icon="el-icon-edit"
                            circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <template v-if="all">
            <el-pagination
                :total="all"
                @current-change="getPage"
                layout="total, prev, pager, next"
                :page-size="10"></el-pagination>
        </template>
        <el-dialog
            title="修改课程信息"
            width="340px"
            v-if="modifyForm"
            :visible.sync="dialogFormVisible">
            <el-form :model="modifyForm">
                <el-form-item label="课程名称" label-width="80px">
                    <el-input v-model="modifyForm.courseName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程代号" label-width="80px">
                    <el-input v-model="modifyForm.courseNumber" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程学分" label-width="80px">
                    <el-input v-model="modifyForm.courseCredit" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程类型" label-width="80px">
                    <el-radio-group v-model="modifyForm.courseType">
                        <el-radio label="require">必修</el-radio>
                        <el-radio label="elective">选修</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="考核方式" label-width="80px">
                    <el-radio-group v-model="modifyForm.courseAssess">
                        <el-radio label="exam">考试</el-radio>
                        <el-radio label="check">考核</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="录入课程信息"
            width="340px"
            :visible.sync="dialogAddCourseFormVisible">
            <el-form :model="addCourseForm">
                <el-form-item label="课程名称" label-width="80px">
                    <el-input v-model="addCourseForm.courseName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程代号" label-width="80px">
                    <el-input v-model="addCourseForm.courseNumber" placeholder="如:C10001" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程学分" label-width="80px">
                    <el-input v-model="addCourseForm.courseCredit" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程类型" label-width="80px">
                    <el-radio-group v-model="addCourseForm.courseType">
                        <el-radio label="require">必修</el-radio>
                        <el-radio label="elective">选修</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="考核方式" label-width="80px">
                    <el-radio-group v-model="addCourseForm.courseAssess">
                        <el-radio label="exam">考试</el-radio>
                        <el-radio label="check">考核</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'CourseList',
  data () {
    return {
      courseList: null,
      all: 0,
      courseColumnList: [
        {
          label: '课程名称',
          prop: 'courseName'
        },
        {
          label: '课程号',
          prop: 'courseNumber'
        },
        {
          label: '课程考核方式',
          prop: 'showCourseAssess'
        },
        {
          label: '课程类型',
          prop: 'showCourseType'
        },
        {
          label: '课程学分',
          prop: 'courseCredit'
        }
      ],
      dialogFormVisible: false,
      modifyForm: null,
      modifyRow: -1,
      dialogAddCourseFormVisible: false,
      addCourseForm: {
        courseName: '',
        courseNumber: '',
        courseCredit: '',
        courseType: 'require',
        courseAssess: 'exam'
      }
    }
  },
  methods: {
    handleCancel () {
      this.dialogFormVisible = false
      this.dialogAddCourseFormVisible = false
    },
    getPage (page) {
      this.$get(
        '/common/course/getCourseList',
        {
          page,
          limit: 10
        }
      )
        .then(res => {
          if (res.code === 2000) {
            for (let item of res.dataList) {
              item.showCourseAssess = item.courseAssess === 'check' ? '考核' : '考试'
              item.showCourseType = item.courseType === 'require' ? '必修' : '选修'
            }
            this.courseList = res.dataList
            this.all = res.databaseSum
          }
        })
    },
    callEdit (index) {
      this.modifyForm = Object.assign({}, this.courseList[index])
      this.dialogFormVisible = true
      this.modifyRow = index
    },
    handleEditConfirm () {
      const modifyForm = this.modifyForm
      const courseData = this.courseList[this.modifyRow]
      if (modifyForm.courseCredit < 1 || modifyForm.courseCredit > 5) {
        this.$errorToast('学分需要在1到5之间')
        return
      }
      let flag = false
      for (let i in courseData) {
        if (modifyForm[i] !== courseData[i]) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.$errorNotify('信息没有修改')
        return
      }
      this.$post('/admin/course/modifyCourseInfo', modifyForm)
        .then(res => {
          if (res.code === 2000) {
            this.$successToast('修改课程信息成功')
            for (let i in modifyForm) {
              courseData[i] = modifyForm[i]
            }
            courseData.showCourseAssess = courseData.courseAssess === 'check' ? '考核' : '考试'
            courseData.showCourseType = courseData.courseType === 'require' ? '必修' : '选修'
            this.dialogFormVisible = false
          } else {
            this.$errorToast(res.message)
          }
        })
        .catch(() => {
          this.$errorNotify('修改课程信息失败')
        })
    },
    handleAddCourse () {
      this.dialogAddCourseFormVisible = true
    },
    handleAddConfirm () {
      const addCourseForm = this.addCourseForm
      if (addCourseForm.courseCredit < 1 || addCourseForm.courseCredit > 5) {
        this.$errorToast('学分需要在1到5之间')
        return
      }
      for (let i in addCourseForm) {
        if (addCourseForm[i] === '') {
          this.$errorNotify(`${i}字段不能为空`)
          return
        }
      }
      this.$post('/admin/course/addCourse', addCourseForm)
        .then(res => {
          if (res.code === 2000) {
            this.$successToast('添加课程成功')
            this.dialogAddCourseFormVisible = false
            this.getPage(1)
          } else {
            this.$errorToast(res.message)
          }
        })
        .catch(() => {
          this.$errorNotify('添加课程失败')
        })
    }
  },
  activated () {
    this.getPage(1)
  }
}
</script>

<style lang="stylus" scoped>
>>> .el-table
    width 100%
    text-align center
    th,td
        text-align center
>>> .el-pagination
    text-align center
    margin-top 20px
.addCourse
    float right
    margin-bottom 10px
</style>
