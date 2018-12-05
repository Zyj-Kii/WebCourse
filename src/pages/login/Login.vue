<template>
    <div>
        <div class="header">五邑大学管理系统</div>
        <div class="box">
            <el-form label-position="right" label-width="80px">
                <el-form-item label="账号">
                    <el-input placeholder="输入账号" v-model="formData.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input
                        placeholder="输入密码"
                        type="password"
                        v-model="formData.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" v-if="isRegister()">
                    <el-input
                        @change="checkPassword"
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
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      type: '登陆',
      toggle: '注册',
      check: null,
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
      status.result = true
      this.checkLogin()
      if (status.result && formData.password !== formData.confirmPassword) {
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
      }
      this.showError()
      return status.result
    },
    showError () {
      const status = this.status
      if (!status.result) {
        this.$message({
          message: status.message,
          type: 'error'
        })
      }
    },
    submit () {
      const formData = this.formData
      if (this.type === '登陆' && this.checkLogin()) {
        axios.post('/api/admin/adminLogin',
          `adminName=${formData.account}&adminPassword=${formData.password}`
        )
          .then(res => {
            if (res.code === 4000) {
              this.$route.push({path: '/'})
            }
          })
          .catch(error => {
            console.log(error)
          })
      } else if (this.checkRegister()) {
        axios.post('/api/admin/registerAdmin', {
          adminName: formData.account,
          adminPassword: formData.password
        })
          .then(res => {
            console.log(res)
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    @import "~styles/variables.styl"
    .header
        position fixed
        top 0
        left 0
        right 0
        line-height 60px
        background $bgColor
        color: #fff
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
