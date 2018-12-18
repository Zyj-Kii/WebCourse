<template>
  <el-container>
      <el-header>五邑大学管理系统
        <router-link to="/account/modify" class="modify">修改密码</router-link>
        <a
          href="javascript:void(0)"
          @click="logout"
          class="logout">退出登陆</a>
      </el-header>
      <el-container>
        <el-aside style="background-color: rgb(238, 241, 246)">
          <el-menu
            @select="select"
            :unique-opened=true
            default-active="1"
            class="el-menu-vertical-demo"
          >
            <template v-for="(item, key) of menu">
              <el-menu-item
                v-if="!item.submenu"
                :index="key + 1 + ''"
                :key="key + 1">
                <router-link :to="item.href"><span>{{item.title}}</span></router-link>
              </el-menu-item>
              <el-submenu
                :index="key + 1 + ''"
                :class="'-' + (key + 1)"
                :key="key + 1"
                v-if="item.submenu">
                <template slot="title">{{item.title}}</template>
                <el-menu-item
                  style="padding: 0"
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
          title: '报表查询以及修改',
          submenu: [
            {
              title: '学生报表',
              href: '/basic/student/check'
            },
            {
              title: '教师报表',
              href: '/basic/teacher/check'
            },
            {
              title: '课程档案报表',
              href: '/basic/course/list'
            }
          ]
        },
        // {
        //   title: '简单查询',
        //   submenu: [
        //     {
        //       title: '学生情况查询',
        //       href: '/simple/studentInfo'
        //     },
        //     {
        //       title: '课程档案查询',
        //       href: '/simple/courseInfo'
        //     },
        //     {
        //       title: '选课及成绩查询',
        //       href: '/simple/courseAndGrade'
        //     },
        //     {
        //       title: '教师情况查询',
        //       href: '/simple/teacherInfo'
        //     }
        //   ]
        // },
        {
          title: '统计查询',
          submenu: [
            {
              title: '各院系人数生源地分布查询',
              href: '/summary/department/student/source'
            },
            {
              title: '各院系按性别统计人数查询',
              href: '/summary/department/student/gender'
            }
          ]
        }
        // },
        // {
        //   title: '报表打印',
        //   submenu: [
        //     {
        //       title: '学生情况报表',
        //       href: '/print/student'
        //     },
        //     {
        //       title: '学生成绩报表',
        //       href: '/print/studentGrade'
        //     },
        //     {
        //       title: '生源地人数统计',
        //       href: '/print/studentSource'
        //     },
        //     {
        //       title: '课程档案一览表',
        //       href: '/summary/course/list'
        //     }
        //   ]
        // }
      ]
    }
  },
  methods: {
    logout () {
      this.$get('/admin/adminLogout')
        .then(res => {
          if (res.code === 2000 || res.code === 5001) {
            this.$successToast('退出登录成功', 1500)
            setTimeout(() => {
              this.$router.push({path: '/account/signin'})
            }, 1500)
          } else {
            this.$errorToast(res.message, 1500)
          }
        })
        .catch(error => {
          this.errorTips(error)
        })
    },
    select (index, indexPath) {
      console.log(index)
      console.log(indexPath)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/variables.styl"
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
    .logout,.modify
      float right
      color #f1f1f1
      padding-left 15px
  .el-container
    margin-top 30px
  .el-aside
    color #333
    text-align center
    line-height 100px
    >>> a
      display inline-block
      padding 0
      width 100%
      height 100%
    .is-opened
      background $bgColor
      >>> .el-submenu__title
        color #fff
        i
          color #fff
      >>> .is-active
        background #67C23A
        a
          color #fff
  .el-main
    background-color #E9EEF3
    color #333
    text-align center

  body > .el-container
    margin-bottom 40px
  a
    color #333
    text-decoration none
</style>
