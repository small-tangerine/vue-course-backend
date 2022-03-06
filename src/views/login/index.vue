<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('navbar.logoTitle') }}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item v-if="isReset" prop="verifyCode" class="verify-code">
        <span class="svg-container">
          <svg-icon icon-class="validCode" />
        </span>
        <el-input
          ref="verifyCode"
          v-model="loginForm.verifyCode"
          type="text"
          placeholder="验证码"
          name="verifyCode"
          tabindex="1"
          auto-complete="off"
        />
        <span :disabled="isDisabled" @click="sendCode" :style="{cursor: isDisabled ? '':`pointer`,
        'pointer-events': isDisabled ? 'none':'auto',
        'color': isDisabled ? '#C0C4CC': '#fff'
      }">{{ buttonText }}</span>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item v-if="isReset" prop="checkPassword">
        <span class="svg-container">
          <svg-icon icon-class="check-password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.checkPassword"
          :type="passwordType"
          placeholder="确认密码"
          name="checkPassword"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button v-if="isReset" :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleResetPassword">重置密码</el-button>
      <el-button v-else :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
      <div class="tips">
        <span v-if="isReset" @click="isReset= false">返回登录</span>
        <span v-else @click="resetPassword">忘记密码</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import {resetPassword} from "@/api/user";
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.loginForm.password){
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      isDisabled: false,
      flag: true,
      buttonText: '发送验证码',
      loginForm: {
        username: 'admin',
        password: 'a1234567',
        checkPassword: undefined,
        verifyCode:undefined
      },
      isReset: false,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'blur', message:'请输入验证码' }],
        checkPassword: [{ required: true, trigger: 'blur', validator: validateCheckPassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // <!--发送验证码-->
    sendCode () {
      this.$refs['loginForm'].validateField('username', valid => {
        if (!valid) {
          let time = 60
          this.buttonText = '重新发送 ' + time
          this.isDisabled = true
          if (this.flag) {
            this.flag = false;
            let timer = setInterval(() => {
              time--;
              this.buttonText = '重新发送 ' + time
              if (time === 0) {
                clearInterval(timer);
                this.buttonText = '重新发送'
                this.isDisabled = false
                this.flag = true;
              }
            }, 1000)
          }
        }
      })
    },
    resetPassword(){
      this.isReset =true
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleResetPassword(){
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.loading = true
        resetPassword(this.loginForm).then((res) => {
            if (res.error === 0) {
              this.$router.push({path: '/login'})
              this.$message.success(res.msg)
            }
            this.loading = false
            this.isReset = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleLogin() {
      this.loginForm.checkPassword= undefined
      this.loginForm.verifyCode = undefined
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .verify-code{
      .el-input {
        width: 70%!important;
      }
    }
  }

  .tips {
    font-size: 14px;
    float: right;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
      cursor: pointer;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
