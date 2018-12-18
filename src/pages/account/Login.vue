<template>
    <div>
        <div class="box">
            <el-form label-position="right" label-width="80px">
                <el-form-item label="用户名">
                    <el-input placeholder="输入用户名" v-model="formData.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input
                        placeholder="输入密码"
                        type="password"
                        v-model="formData.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" v-if="isRegister()">
                    <el-input
                        placeholder="确认密码"
                        type="password"
                        v-model="formData.confirmPassword">
                    </el-input>
                </el-form-item>
                <el-button @click="submit" type="primary">{{type}}</el-button>
                <a @click="swap" href="javascript:void(0)" class="toggle">{{toggle}}</a>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      type: '',
      toggle: '',
      errorMsg: '',
      formData: {
        account: '',
        password: '',
        confirmPassword: ''
      },
      status: {
        result: true,
        message: ''
      }
    }
  },
  methods: {
    swap () {
      [this.type, this.toggle] = [this.toggle, this.type]
    },
    isRegister () {
      return this.type === '注册'
    },
    checkRegister () {
      const status = this.status
      const formData = this.formData
      this.checkLogin()
      if (!status.result) {
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        status.result = false
        status.message = '密码不匹配，请再次确认'
      }
      this.showError()
      return status.result
    },
    checkLogin () {
      const status = this.status
      const formData = this.formData
      status.result = true
      if (formData.account === '') {
        status.result = false
        status.message = '账号不能为空'
      } else if (formData.password === '') {
        status.result = false
        status.message = '密码不能为空'
      } else if (formData.password.length < 6 || formData.password.length > 20) {
        status.result = false
        status.message = '密码长度需在6-20之间'
      }
      this.showError()
      return status.result
    },
    showError () {
      const status = this.status
      if (!status.result) {
        this.$errorToast(status.message)
      }
    },
    submit () {
      const formData = this.formData
      if (this.type === '登录' && this.checkLogin()) {
        this.$post('/admin/adminLogin', {
          adminName: formData.account,
          adminPassword: formData.password
        })
          .then(
            res => {
              console.table(res)
              if (res.code === 2000) {
                this.goToHome('登陆成功')
                sessionStorage.admin = this.formData.account
              } else {
                this.$errorNotify(res.message)
              }
            }
          )
          .catch(error => {
            console.log(error)
          })
      } else if (this.checkRegister()) {
        this.$post(
          '/admin/registerAdmin',
          {
            adminName: formData.account,
            adminPassword: formData.password
          }
        )
          .then(
            res => {
              if (res.code === 2000) {
                this.goToHome('注册成功')
              } else {
                this.$errorNotify(res.message)
              }
            }
          )
          .catch(error => {
            this.$errorNotify(error)
          })
      }
    },
    goToHome (message) {
      this.$successToast(message, 1500)
      setTimeout(() => {
        this.$router.push({path: '/'})
      }, 1500)
    }
  },
  activated () {
    if (this.$route.path.split('/')[1] === 'signup') {
      this.type = '注册'
      this.toggle = '登录'
    } else {
      this.type = '登录'
      this.toggle = '注册'
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
