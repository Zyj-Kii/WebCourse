<template>
  <el-container>
      <el-header>五邑大学管理系统</el-header>
      <el-container>
        <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
          >
            <template v-for="(item, key) of menu">
              <el-menu-item
                v-if="!item.submenu"
                :index="key + 1"
                :key="key + 1">
                <router-link :to="item.href"><span>{{item.title}}</span></router-link>
              </el-menu-item>
              <el-submenu
                :index="key + 1"
                :key="key + 1"
                v-if="item.submenu">
                <template slot="title">{{item.title}}</template>
                <el-menu-item
                  v-for="(subItem, subKey) of item.submenu"
                  :key="(key + 1) + '-' + (subKey + 1)"
                  :index="(key + 1) + '-' + (subKey + 1)">
                  <router-link :to="subItem.href">{{subItem.title}}</router-link>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <keep-alive>
            <router-view/>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      menu: [
        {
          title: '基本表数据维护',
          href: '/basic',
          submenu: [
            {
              title: '学生情况维护',
              href: '/studentCheck'
            },
            {
              title: '教师情况维护',
              href: '/teacherCheck'
            },
            {
              title: '选课及成绩维护',
              href: '/chooseCourseAndGrade'
            },
            {
              title: '教师讲授课程维护',
              href: '/teacherCourse'
            },
            {
              title: '课程档案维护',
              href: '/courseSave'
            }
          ]
        },
        {
          title: '简单查询',
          href: '/simpleSearch',
          submenu: [
            {
              title: '学生情况查询',
              href: '/basic/studentInfo'
            },
            {
              title: '课程档案查询',
              href: '/basic/courseInfo'
            },
            {
              title: '选课及成绩查询',
              href: '/basic/courseAndGrade'
            },
            {
              title: '教师情况查询',
              href: '/basic/teacherInfo'
            }
          ]
        },
        {
          title: '统计查询',
          submenu: [
            {
              title: '学生情况查询',
              href: '/summary/studentInfo'
            },
            {
              title: '各院系人数生源地分布查询',
              href: '/summary/deptSource'
            },
            {
              title: '生源地人数统计查询',
              href: '/summary/source'
            },
            {
              title: '各院系按性别统计人数查询',
              href: '/summary/bySex'
            },
            {
              title: '学生成绩查询',
              href: '/summary/studentGrade'
            },
            {
              title: '各院系按课程的平均成绩查询',
              href: '/summary/deptCourseAVG'
            },
            {
              title: '各院系不及格课程名称',
              href: '/summary/deptFailStudent'
            },
            {
              title: '按性别统计课程的平均成绩',
              href: '/summary/AVGbySex'
            }
          ]
        },
        {
          title: '报表打印',
          submenu: [
            {
              title: '学生情况报表',
              href: '/print/student'
            },
            {
              title: '学生成绩报表',
              href: '/print/studentGrade'
            },
            {
              title: '生源地人数统计',
              href: '/print/studentSource'
            },
            {
              title: '课程档案一览表',
              href: '/print/showCourse'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-header, .el-footer
    background-color #409eff
    color #fff
    text-align center
    line-height 60px
  .el-header
    position fixed
    left 0
    right 0
    top 0
  .el-container
    margin-top 30px
  .el-aside
    color #333
    text-align center
    line-height 100px
    width 200px
  .el-main
    background-color #E9EEF3
    color #333
    text-align center
    line-height 160px

  body > .el-container
    margin-bottom 40px
  a
    color #333
    text-decoration none

</style>
