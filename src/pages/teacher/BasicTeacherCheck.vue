<template>
    <div class="root">
        <el-select
            v-model="selected"
            @change="getTeacherList(1)">
            <template v-if="options">
                <el-option
                    v-for="(item, key) of options"
                    :key="key"
                    :label="item.collegeName"
                    :value="item.collegeId"
                ></el-option>
            </template>
        </el-select>
        <el-button class="addTeacher" @click="addTeacher" type="primary">
            添加教师
        </el-button>
        <template v-if="teacherList">
            <el-table
                :data="teacherList"
                stripe>
                <el-table-column
                    v-for="(column, key) of columnList"
                    :prop="column.prop"
                    :label="column.label"
                    :show-overflow-tooltip="true"
                    :key="key"
                >
                </el-table-column>
                <el-table-column
                    width="400px"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            @click="callEdit(scope.$index)"
                            size="small"
                            type="primary"
                            icon="el-icon-edit"
                            circle></el-button>
                        <el-button
                            type="success"
                            size="small"
                            @click="getCourse(scope.$index)">
                            获取课表
                        </el-button>
                        <el-button
                            type="primary"
                            size="small"
                            @click="getAllCourse(1, scope.$index)">
                            添加课程
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top: 20px"
                :total="allData"
                @current-change="getTeacherList"
                layout="total, prev, pager, next"
                :page-size="10"></el-pagination>
        </template>
        <template v-if="dialogFormRender">
            <el-dialog
                title="修改教师信息"
                width="340px"
                :visible.sync="dialogFormVisible">
                <el-form :model="modifyForm">
                    <el-form-item label="教师姓名" label-width="80px">
                        <el-input v-model="modifyForm.teacherName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="教工号" label-width="80px">
                        <el-input v-model="modifyForm.teacherNumber" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="教师职称" label-width="80px">
                        <el-input v-model="modifyForm.teacherGrade" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="教师性别" label-width="80px">
                        <el-radio-group v-model="modifyForm.teacherGender">
                            <el-radio label="m">男</el-radio>
                            <el-radio label="f">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
                </div>
            </el-dialog>
        </template>
        <template v-if="teacherCourseList">
            <el-dialog width="1200px" title="教师课表"  :visible.sync="dialogTeacherCourseVisible">
                <el-table
                    :data="teacherCourseList"
                    stripe>
                    <el-table-column
                        v-for="(item, key) of chooseCourseList"
                        :prop="item.prop"
                        :label="item.label"
                        :key="key">
                    </el-table-column>
                    <el-table-column
                        label="任课时间"
                        prop="courseTime">
                    </el-table-column>
                    <el-table-column width="200px" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="showStudent(scope.$index)"
                                type="primary">
                            查看学生</el-button>
                            <el-button
                                type="warning"
                                size="mini"
                                @click="handleRemoveCourse(scope.$index)">
                                退课</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <template v-if="teacherCourseAll">
                    <el-pagination
                        :total="teacherCourseAll"
                        @current-change="getTeacherCourse"
                        layout="total, prev, pager, next"
                        :page-size="6"></el-pagination>
                </template>
                <template v-if="courseStudentList">
                    <el-dialog
                        width="80%"
                        title="课程学生"
                        :visible.sync="innerVisible"
                        append-to-body>
                        <el-table
                            :data="courseStudentList">
                            <el-table-column
                                v-for="(item, key) of studentColumn"
                                :key="key"
                                :label="item.label"
                                :prop="item.prop"
                            ></el-table-column>
                            <el-table-column
                                label="成绩"
                            >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.studentCourseScore !== -1">
                                        {{ scope.row.studentCourseScore }}
                                    </span>
                                    <el-input
                                        v-else
                                        placeholder="设置分数"
                                        @blur="validateScore(scope.row)"
                                        v-model="scope.row.setScore"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        v-if="scope.row.studentCourseScore === -1"
                                        type="primary"
                                        @click="handleSetScore(scope.$index)">赋分</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            :total="courseStudentAll"
                            @current-change="getCourseStudent"
                            layout="total, prev, pager, next"
                            :page-size="6"></el-pagination>
                    </el-dialog>
                </template>
            </el-dialog>
        </template>
        <template v-if="allChooseCourseList">
            <el-dialog
               title="教师选课"
               :visible.sync="dialogChooseCourseVisible">
                <el-table
                    :data="allChooseCourseList"
                    stripe>
                    <el-table-column
                        v-for="(item, key) of chooseCourseList"
                        :prop="item.prop"
                        :label="item.label"
                        :key="key">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                @click="handleChooseCourse(scope.$index)">
                                选择该课</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <template v-if="allChooseCourse">
                    <el-pagination
                        :total="allChooseCourse"
                        @current-change="getAllCourse"
                        layout="total, prev, pager, next"
                        :page-size="6"></el-pagination>
                </template>
            </el-dialog>
        </template>
        <el-dialog
           title="添加教师"
           width="340px"
           :visible.sync="dialogAddTeacherVisible">
            <el-form :model="addTeacherForm">
                <el-form-item label="教师姓名" label-width="80px">
                    <el-input v-model="addTeacherForm.teacherName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="教工号" label-width="80px">
                    <el-input
                        v-model="addTeacherForm.teacherNumber"
                        placeholder="如：j10001"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属学院" label-width="80px">
                    <el-input
                        disabled=""
                        v-model="addTeacherForm.showCollegeName"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="教师职称" label-width="80px">
                    <el-input v-model="addTeacherForm.teacherGrade" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="教师性别" label-width="80px">
                    <el-radio-group v-model="addTeacherForm.teacherGender">
                        <el-radio label="m">男</el-radio>
                        <el-radio label="f">女</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddTeacherConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'BasicTeacherCheck',
  data () {
    return {
      selected: '',
      options: null,
      teacherList: null,
      dialogFormVisible: false,
      dialogTableVisible: false,
      dialogFormRender: false,
      dialogTableRender: false,
      modifyForm: null,
      modifyRow: 0,
      allData: 0,
      currentPage: 0,
      columnList: [
        {
          label: '教工号',
          prop: 'teacherNumber'
        },
        {
          label: '姓名',
          prop: 'teacherName'
        },
        {
          label: '性别',
          prop: 'showTeacherGender'
        },
        {
          label: '教师职称',
          prop: 'teacherGrade'
        }
      ],
      chooseCourseList: [
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
      studentColumn: [
        {
          label: '学号',
          prop: 'studentNumber'
        },
        {
          label: '姓名',
          prop: 'studentName'
        },
        {
          label: '性别',
          prop: 'showStudentGender'
        },
        {
          label: '政治面貌',
          prop: 'showStudentPoliticsStatus'
        },
        {
          label: '来源地',
          prop: 'studentFrom'
        },
        {
          label: '出生日期',
          prop: 'showStudentBirthday'
        }
      ],
      courseStudentList: null,
      courseStudentAll: 0,
      innerVisible: false,
      allChooseCourseList: null,
      dialogChooseCourseVisible: false,
      teacherCourseList: null,
      dialogTeacherCourseVisible: false,
      dialogAddTeacherVisible: false,
      addTeacherForm: {
        teacherNumber: '',
        teacherName: '',
        teacherGender: '',
        teacherGrade: '',
        showCollegeName: '',
        collegeId: 0
      },
      allChooseCourse: 0,
      saveTeacherId: 0,
      teacherCourseAll: 0,
      saveTeacherCourseId: 0
    }
  },
  methods: {
    toLogin () {
      this.$router.push({path: '/account/signin'})
    },
    getTeacherList (page) {
      this.$get(
        '/admin/teacherCollege/getCollegeTeacher',
        {
          collegeId: this.selected,
          page,
          limit: 10
        })
        .then(res => {
          if (res.code === 2000) {
            this.allData = res.databaseSum
            this.teacherList = res.dataList
            for (let item of this.teacherList) {
              this.$set(item, 'showTeacherGender', (item.teacherGender === 'm' ? '男' : '女'))
              this.$set(item, 'showTeacherBirthday', this.$formatDate(item.teacherBirthday))
            }
          } else if (res.code === 5001) {
            this.$errorNotify('请先登陆')
            setTimeout(this.toLogin, 1500)
          } else {
            this.teacherList = null
            this.$errorNotify(res.message)
          }
        })
        .catch(error => {
          this.$errorNotify(error)
        })
    },
    callEdit (index) {
      this.modifyForm = Object.assign({}, this.teacherList[index])
      this.modifyRow = index
      this.dialogFormRender = true
      this.dialogFormVisible = true
    },
    getCourse (index) {
      this.saveTeacherId = this.teacherList[index].teacherId
      this.getTeacherCourse(1)
    },
    getTeacherCourse (page) {
      const teacherId = this.saveTeacherId
      this.$get('/admin/course/getTeacherCourseList',
        {
          page,
          limit: 6,
          teacherId
        }
      )
        .then(res => {
          if (res.code === 2000) {
            for (let item of res.dataList) {
              item.showCourseAssess = item.courseAssess === 'check' ? '考核' : '考试'
              item.showCourseType = item.courseType === 'require' ? '必修' : '选修'
            }
            this.teacherCourseList = res.dataList
            this.teacherCourseAll = res.databaseSum
            this.dialogTeacherCourseVisible = true
          } else if (res.code === 4000) {
            this.dialogTeacherCourseVisible = false
            this.$errorNotify('该教师暂无课程计划')
          }
        })
        .catch(() => {
          this.$errorNotify()
        })
    },
    getAllCourse (page, index = -1) {
      this.$get('/common/course/getCourseList', {
        page,
        limit: 6
      })
        .then(res => {
          if (res.code === 2000) {
            for (let item of res.dataList) {
              item.showCourseAssess = item.courseAssess === 'check' ? '考核' : '考试'
              item.showCourseType = item.courseType === 'require' ? '必修' : '选修'
            }
            if (index !== -1) {
              this.saveTeacherId = this.teacherList[index].teacherId
            }
            this.allChooseCourseList = res.dataList
            this.allChooseCourse = res.databaseSum
            this.dialogChooseCourseVisible = true
          } else {
            this.$errorNotify('获取所有课程失败')
          }
        })
    },
    handleChooseCourse (index) {
      const courseId = this.allChooseCourseList[index].courseId
      this.$get('/admin/course/teacherSelectCourse',
        {
          teacherId: this.saveTeacherId,
          courseId,
          courseTime: '2018-2019-2'
        }
      )
        .then(res => {
          if (res.code === 2000) {
            this.$successToast('选课成功')
            this.dialogChooseCourseVisible = false
          } else {
            this.$errorNotify(res.message)
          }
        })
        .catch(() => {
          this.$errorNotify('选课失败')
        })
    },
    handleCancel () {
      this.dialogFormVisible = false
      this.dialogAddTeacherVisible = false
    },
    handleEditConfirm () {
      const modifyForm = this.modifyForm
      const teacherData = this.teacherList[this.modifyRow]
      let flag = false
      for (let i in modifyForm) {
        if (modifyForm[i] !== teacherData[i]) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.$errorToast('没有修改信息')
      } else {
        const time = new Date(modifyForm.teacherBirthday).getTime()
        modifyForm.teacherBirthday = time
        this.$post('admin/modifyTeacherInfo', modifyForm)
          .then(res => {
            if (res.code === 2000) {
              this.$successToast('修改信息成功')
              this.dialogFormVisible = false
              for (let i in modifyForm) {
                teacherData[i] = modifyForm[i]
              }
              teacherData.showTeacherBirthday = this.$formatDate(time)
              teacherData.showTeacherGender = teacherData.teacherGender === 'm' ? '男' : '女'
            } else {
              this.$errorNotify(res.message)
            }
          })
          .catch(() => {
            this.$errorNotify('修改信息失败')
          })
      }
    },
    handleRemoveCourse (index) {
      const teacherCourseId = this.teacherCourseList[index].teacherCourseId
      this.$get('/admin/course/teacherDropCourse', {teacherCourseId})
        .then(res => {
          if (res.code === 2000) {
            this.$successToast('退课成功')
            this.getTeacherCourse(1)
          } else {
            this.$errorNotify(res.message)
          }
        })
        .catch(() => {
          this.$errorNotify('退课失败')
        })
    },
    addTeacher () {
      this.dialogAddTeacherVisible = true
      this.addTeacherForm.collegeId = this.selected
      for (let i of this.options) {
        if (i.collegeId === this.selected) {
          this.addTeacherForm.showCollegeName = i.collegeName
        }
      }
    },
    handleAddTeacherConfirm () {
      const data = this.addTeacherForm
      for (let i in data) {
        if (data[i] === '') {
          this.$errorToast(`字段${i}不能留空`)
          return
        }
      }
      this.$post('/admin/adminTeacher/addTeacher', data)
        .then(res => {
          if (res.code === 2000) {
            const teacherId = res.insertId
            const collegeId = this.selected
            this.$get('/admin/teacherCollege/addTeacherIntoCollege', {
              teacherId,
              collegeId
            })
              .then(res => {
                if (res.code === 2000) {
                  this.$successToast('添加教师成功')
                  this.dialogAddTeacherVisible = false
                  this.getTeacherList(1)
                } else {
                  this.$get('/admin/adminTeacher/deleteTeacher', {teacherId})
                    .then(() => {
                      this.$errorNotify('添加教师失败')
                    })
                    .catch(() => {
                      this.$errorNotify('添加教师失败')
                    })
                }
              })
              .catch(() => {
                this.$get('/admin/adminTeacher/deleteTeacher', {teacherId})
                  .then(() => {
                    this.$errorNotify('添加教师失败')
                  })
                  .catch(() => {
                    this.$errorNotify('添加教师失败')
                  })
              })
          }
        })
    },
    showStudent (index) {
      this.saveTeacherCourseId = this.teacherCourseList[index].teacherCourseId
      this.getCourseStudent(1)
    },
    getCourseStudent (page) {
      const teacherCourseId = this.saveTeacherCourseId
      const limit = 6
      this.$get('/admin/course/getStudentByTeacherCourseId', {teacherCourseId, page, limit})
        .then(res => {
          if (res.code === 2000) {
            for (let item of res.dataList) {
              item.showStudentGender = item.studentGender === 'm' ? '男' : '女'
              item.setScore = ''
              item.showStudentBirthday = this.$formatDate(item.studentBirthday)
              switch (item.studentPoliticsStatus) {
                case 'youth':
                  item.showStudentPoliticsStatus = '共青团员'
                  break
                case 'crowd':
                  item.showStudentPoliticsStatus = '群众'
                  break
                case 'preParty':
                  item.showStudentPoliticsStatus = '预备党员'
                  break
                case 'party':
                  item.showStudentPoliticsStatus = '党员'
                  break
              }
            }
            this.courseStudentList = res.dataList
            this.courseStudentAll = res.databaseSum
            this.innerVisible = true
          } else {
            this.$errorToast(res.message)
          }
        })
        .catch(() => {
          this.$errorNotify('获取学生列表失败')
        })
    },
    handleSetScore (index) {
      const courseStudentData = this.courseStudentList[index]
      const studentCourseId = courseStudentData.studentCourseId
      const studentCourseScore = courseStudentData.setScore
      this.$get('/admin/course/updateStudentCourseScore', {studentCourseId, studentCourseScore})
        .then(res => {
          if (res.code === 2000) {
            courseStudentData.studentCourseScore = studentCourseScore
            this.$successToast('赋分成功')
          } else {
            this.$errorNotify(res.message())
          }
        })
        .catch(() => {
          this.$errorNotify('赋分失败')
        })
    },
    validateScore (score) {
      if (score.setScore === '') {
        return
      }
      const setScore = parseFloat(score.setScore)
      if (!setScore) {
        this.$errorToast('输入不能为非数字')
      } else if (setScore < 0) {
        this.$errorToast('输入分数不能低于0')
      } else if (setScore > 100) {
        this.$errorToast('输入分数不能高于100')
      } else {
        return
      }
      score.setScore = ''
    }
  },
  activated () {
    if (sessionStorage.collegeList) {
      this.options = JSON.parse(sessionStorage.collegeList)
      this.selected = this.options[0].collegeId
      this.getTeacherList(1)
      return
    }
    this.$get(
      '/common/college/getCollegeList',
      {
        page: 1,
        limit: 100
      }
    )
      .then(res => {
        if (res.code === 2000) {
          this.options = res.dataList
          this.selected = res.dataList[0].collegeId
          sessionStorage.collegeList = JSON.stringify(this.options)
          this.getTeacherList(1)
        }
      })
      .catch(() => this.$errorNotify('请求出错'))
  }
}
</script>

<style lang="stylus" scoped>
    .root
        text-align left
    >>> .el-table
        margin-top 20px
        width 100%
        text-align center
        th,td
            text-align center
    >>> .el-pagination
        text-align center
        margin-top 20px
    .addTeacher
        margin-left 10px
</style>
