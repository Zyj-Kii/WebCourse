<template>
    <div class="box">
        <el-form label-position="right" label-width="90px">
            <el-form-item label="用户名">
                <el-input
                    :disabled="true"
                    v-model="admin"></el-input>
            </el-form-item>
            <el-form-item label="旧密码">
                <el-input
                    placeholder="输入旧密码"
                    type="password"
                    v-model="formData.prePassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input
                    placeholder="新密码"
                    type="password"
                    v-model="formData.newPassword">
                </el-input>
            </el-form-item>
            <el-form-item label="确认新密码">
                <el-input
                    placeholder="确认新密码"
                    type="password"
                    v-model="formData.confirmPassword">
                </el-input>
            </el-form-item>
            <el-button @click="submit" type="primary">更新密码</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'ModifyPassword',
  data () {
    return {
      admin: '',
      formData: {
        prePassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    submit () {
      const formData = this.formData
      if (formData.prePassword.length < 6 || formData.newPassword.length < 6) {
        this.$errorNotify('密码长度不可少于6个字符')
        return false
      } else if (formData.newPassword !== formData.confirmPassword) {
        this.$errorNotify('密码不一致，请重新确认')
        return false
      }
      this.$post('admin/modifyAdminPassword', formData)
        .then(res => {
          if (res.code === 2000) {
            this.$successToast('修改密码成功！')
            setTimeout(() => {
              this.$router.push({path: '/'})
            }, 3000)
          } else {
            this.$errorNotify(res.message)
          }
        })
    }
  },
  activated () {
    if (sessionStorage.admin) {
      this.admin = sessionStorage.admin
    } else {
      this.$errorNotify('尚未登录', 1500)
      setTimeout(() => {
        this.$router.push({path: '/account/signin'})
      }, 1500)
    }
  }
}
</script>

<style lang="stylus" scoped>
    .box
        position fixed
        top 50%
        left 50%
        transform translate(-50%,-100%)
        background #fff
        padding 30px
        border-radius 5px
        width 400px
        .toggle
            margin-left 10px
            color #ffa100
</style>
