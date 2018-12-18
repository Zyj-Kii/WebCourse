<template>
    <div class="root">
        <el-select
            v-model="selected"
            @change="getStudentList(1)">
            <template v-if="options">
                <el-option
                  v-for="(item, key) of options"
                  :key="key"
                  :label="item.collegeName"
                  :value="item.collegeId"
                ></el-option>
            </template>
        </el-select>
        <el-button @click="addStudent" class="addStudent" type="primary">添加学生</el-button>
        <template v-if="studentList">
            <el-table
                :data="studentList"
                stripe>
                <el-table-column
                    v-for="(item, key) of studentColumn"
                    :key="key"
                    :prop="item.prop"
                    :label="item.label">
                </el-table-column>
                <el-table-column
                    width="300px"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="callEdit(scope.$index)"
                            type="primary"
                            icon="el-icon-edit"
                            circle></el-button>
                        <el-button
                            size="small"
                            type="primary"
                            @click="checkCourse(scope.$index)"
                        >查看课表</el-button>
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleSelectCourse(scope.$index)"
                        >选课</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top: 20px"
                :total="allData"
                @current-change="getStudentList"
                layout="total, prev, pager, next"
                :page-size="10"></el-pagination>
        </template>
        <el-dialog
            title="修改学生信息"
            width="340px"
            v-if="modifyForm"
            :visible.sync="dialogFormVisible">
            <el-form :model="modifyForm">
                <el-form-item label="学生姓名" label-width="80px">
                    <el-input v-model="modifyForm.studentName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学号" label-width="80px">
                    <el-input v-model="modifyForm.studentNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="生源地" label-width="80px">
                    <el-input v-model="modifyForm.studentFrom" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" label-width="80px">
                    <el-date-picker
                        v-model="modifyForm.studentBirthday"
                        type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="政治面貌" label-width="80px">
                    <el-select v-model="modifyForm.studentPoliticsStatus">
                        <el-option label="群众" value="crowd"></el-option>
                        <el-option label="共青团员" value="youth"></el-option>
                        <el-option label="预备党员" value="preParty"></el-option>
                        <el-option label="党员" value="party"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学生性别" label-width="80px">
                    <el-radio-group v-model="modifyForm.studentGender">
                        <el-radio label="m">男</el-radio>
                        <el-radio label="f">女</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleEditCancel">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="添加学生"
            width="380px"
            :visible.sync="dialogAddFormVisible">
            <el-form :model="addStudentForm">
                <el-form-item label="学生姓名" label-width="120px">
                    <el-input v-model="addStudentForm.studentName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学号" label-width="120px">
                    <el-input v-model="addStudentForm.studentNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学院" label-width="120px">
                    <el-input v-model="addStudentForm.showCollege" disabled="" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="生源地" label-width="120px">
                    <el-input v-model="addStudentForm.studentFrom" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" label-width="120px">
                    <el-date-picker
                        v-model="addStudentForm.studentBirthday"
                        type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="学生性别" label-width="120px">
                    <el-radio-group v-model="addStudentForm.studentGender">
                        <el-radio label="m">男</el-radio>
                        <el-radio label="f">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="学生政治面貌" label-width="120px">
                    <el-select
                        v-model="addStudentForm.studentPoliticsStatus">
                        <el-option label="群众" value="crowd"></el-option>
                        <el-option label="共青团" value="youth"></el-option>
                        <el-option label="预备党员" value="preParty"></el-option>
                        <el-option label="团员" value="party"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <template v-if="studentCourseList">
            <el-dialog title="学生课表"  :visible.sync="dialogStudentCourseVisible">
                <el-table
                    :data="studentCourseList"
                    stripe>
                    <el-table-column
                        v-for="(item, key) of courseList"
                        :prop="item.prop"
                        :label="item.label"
                        :key="key">
                    </el-table-column>
                    <el-table-column
                        prop="studentCourseScore"
                        label="课程分数"
                    >
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                @click="handleRemoveCourse(scope.$index)">
                                退课</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <template v-if="studentCourseAll">
                    <el-pagination
                        :total="studentCourseAll"
                        @current-change="getCourse"
                        layout="total, prev, pager, next"
                        :page-size="6"></el-pagination>
                </template>
            </el-dialog>
        </template>
        <template v-if="allChooseCourseList">
            <el-dialog
                title="学生选课"
                :visible.sync="dialogChooseCourseVisible">
                <el-table
                    :data="allChooseCourseList"
                    stripe>
                    <el-table-column
                        v-for="(item, key) of courseList"
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
    </div>
</template>

<script>
export default {
  name: 'BasicStudentCheck',
  data () {
    return {
      selected: '',
      options: null,
      studentList: null,
      dialogFormVisible: false,
      modifyForm: null,
      modifyRow: 0,
      allData: 0,
      currentPage: 0,
      dialogAddFormVisible: false,
      addStudentForm: {
        studentNumber: '',
        studentName: '',
        studentGender: '',
        studentBirthday: '',
        studentFrom: '',
        studentPoliticsStatus: '',
        showCollege: '',
        collegeId: 0
      },
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
      courseList: [
        {
          label: '课程名称',
          prop: 'courseName'
        },
        {
          label: '课程代号',
          prop: 'courseNumber'
        },
        {
          label: '课程学分',
          prop: 'courseCredit'
        },
        {
          label: '课程类型',
          prop: 'showCourseType'
        },
        {
          label: '考核方式',
          prop: 'showCourseAssess'
        }
      ],
      dialogStudentCourseVisible: false,
      studentCourseList: null,
      saveStudentId: 0,
      studentCourseAll: 0,
      allChooseCourseList: null,
      allChooseCourse: 0,
      dialogChooseCourseVisible: false
    }
  },
  methods: {
    toLogin () {
      this.$router.push({path: '/account/signin'})
    },
    getStudentList (page) {
      this.$get(
        '/admin/studentCollege/getCollegeStudent',
        {
          collegeId: this.selected,
          page,
          limit: 10
        })
        .then(res => {
          if (res.code === 2000) {
            this.allData = res.databaseSum
            for (let item of res.dataList) {
              item.showStudentGender = item.studentGender === 'm' ? '男' : '女'
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
            this.studentList = res.dataList
          } else if (res.code === 5001) {
            this.$errorNotify('请先登陆')
            setTimeout(this.toLogin, 1500)
          } else {
            this.$errorNotify(res.message)
            this.studentList = null
          }
        })
        .catch(error => {
          this.$errorNotify(error)
        })
    },
    callEdit (index) {
      this.modifyForm = Object.assign({}, this.studentList[index])
      this.modifyRow = index
      this.dialogFormVisible = true
    },
    handleEditCancel () {
      this.dialogFormVisible = false
    },
    handleEditConfirm () {
      const modifyForm = this.modifyForm
      const studentData = this.studentList[this.modifyRow]
      let flag = false
      for (let i in modifyForm) {
        if (modifyForm[i] !== studentData[i]) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.$errorToast('没有修改信息')
      } else {
        const time = new Date(modifyForm.studentBirthday).getTime()
        modifyForm.studentBirthday = time
        this.$post('admin/modifyStudentInfo', modifyForm)
          .then(res => {
            if (res.code === 2000) {
              this.$successToast('修改信息成功')
              this.dialogFormVisible = false
              for (let i in modifyForm) {
                studentData[i] = modifyForm[i]
              }
              studentData.showStudentBirthday = this.$formatDate(time)
              studentData.showStudentGender = studentData.studentGender === 'm' ? '男' : '女'
              switch (studentData.studentPoliticsStatus) {
                case 'youth':
                  studentData.showStudentPoliticsStatus = '共青团员'
                  break
                case 'crowd':
                  studentData.showStudentPoliticsStatus = '群众'
                  break
                case 'preParty':
                  studentData.showStudentPoliticsStatus = '预备党员'
                  break
                case 'party':
                  studentData.showStudentPoliticsStatus = '党员'
                  break
              }
            } else {
              this.$errorNotify(res.message)
            }
          })
          .catch(() => {
            this.$errorNotify('修改信息失败')
          })
      }
    },
    handleAddConfirm () {
      const studentData = this.addStudentForm
      for (let i in studentData) {
        if (studentData[i] === '') {
          this.$errorToast(`字段${i}不能留空`)
          return
        }
      }
      studentData.studentBirthday = new Date(studentData.studentBirthday).getTime()
      this.$post('/admin/adminStudent/addStudent', this.addStudentForm)
        .then(res => {
          if (res.code === 2000) {
            const studentId = res.insertId
            const collegeId = this.selected
            this.$get('/admin/studentCollege/addStudentIntoCollege', {
              studentId,
              collegeId
            })
              .then(res => {
                if (res.code === 2000) {
                  this.$successToast('添加学生成功')
                  this.getStudentList(1)
                  this.dialogAddFormVisible = false
                } else {
                  this.$get('/admin/adminStudent/deleteStudent', {
                    studentId
                  })
                    .then(() => {
                      this.$errorNotify('添加学生失败')
                    })
                    .catch(() => {
                      this.$errorNotify('添加学生出错了')
                    })
                }
              })
          }
        })
    },
    addStudent () {
      const studentForm = this.addStudentForm
      for (let i of this.options) {
        if (i.collegeId === this.selected) {
          studentForm.showCollege = i.collegeName
          break
        }
      }
      studentForm.collegeId = this.selected
      this.dialogAddFormVisible = true
    },
    checkCourse (index) {
      this.saveStudentId = this.studentList[index].studentId
      this.getCourse(1)
    },
    getCourse (page) {
      const studentId = this.saveStudentId
      this.$get('/admin/course/getStudentCourseList', {
        page,
        studentId,
        limit: 6
      })
        .then(res => {
          if (res.code === 2000) {
            for (let i of res.dataList) {
              i.showCourseAssess = i.courseAssess === 'exam' ? '考试' : '考核'
              i.showCourseType = i.courseType === 'require' ? '必修' : '选修'
              i.studentCourseScore = i.studentCourseScore >= 0 ? i.studentCourseScore : '*'
            }
            this.studentCourseList = res.dataList
            this.studentCourseAll = res.databaseSum
            this.dialogStudentCourseVisible = true
          } else if (res.code === 4000) {
            this.$errorNotify('该学生暂未有课程计划')
          }
        })
        .catch(() => {
          this.$errorNotify('获取学生课表失败')
        })
    },
    handleSelectCourse (index) {
      this.saveStudentId = this.studentList[index].studentId
      this.getAllCourse(1)
    },
    handleRemoveCourse (index) {
      const studentCourseId = this.studentCourseList[index].studentCourseId
      this.$get('/admin/course/studentDropCourse', {studentCourseId})
        .then(res => {
          if (res.code === 2000) {
            this.$successToast('退课成功')
            this.getCourse(1)
          } else {
            this.$errorToast(res.message)
          }
        })
        .catch(() => {
          this.$errorNotify('退课失败')
        })
    },
    getAllCourse (page) {
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
      const studentId = this.saveStudentId
      this.$get('/admin/course/studentSelectCourse', {courseId, studentId})
        .then(res => {
          if (res.code === 2000) {
            this.$successToast('选课成功')
          } else {
            this.$errorToast(res.message)
          }
        })
        .catch(() => {
          this.$errorNotify('选课失败')
        })
    }
  },
  activated () {
    if (sessionStorage.collegeList) {
      this.options = JSON.parse(sessionStorage.collegeList)
      this.selected = this.options[0].collegeId
      this.getStudentList(1)
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
          this.getStudentList(1)
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
    .addStudent
        margin-left 10px
</style>
