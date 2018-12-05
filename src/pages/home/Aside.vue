<template>
  <el-menu
     default-active="1"
  >
    <el-menu-item
        v-for="(item, key) of menu"
        :index="key"
        :key="key">
        <span>{{item.title}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'aside',
  data () {
    return {
      menu: [
        {
          title: '基本表数据维护',
          href: '/basic'
        },
        {
          title: '简单查询',
          href: '/simpleSearch'
        },
        {
          title: '统计查询',
          href: '/summarySearch'
        },
        {
          title: '报表打印',
          href: '/printExcel'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
