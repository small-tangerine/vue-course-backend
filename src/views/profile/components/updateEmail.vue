<template>
  <div style="display: inline-block;">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="475px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="新邮箱" prop="email">
          <el-input v-model="form.email" auto-complete="on" style="width: 200px;" />
          <el-button :loading="codeLoading" :disabled="isDisabled" size="small" @click="sendCode">{{ buttonName }}</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="form.code" style="width: 320px;" />
        </el-form-item>
        <el-form-item label="当前密码" prop="userPassword">
          <el-input v-model="form.userPassword" type="password" style="width: 320px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="doSubmit">提交</el-button>
        <el-button type="text" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateEmail } from '@/api/user'

export default {
  name: 'UpdateEmail',
  props: {
    email: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('新邮箱不能为空'))
      } else {
        callback()
      }
    }
    return {
      loading: false, dialog: false, title: '修改邮箱', form: { userPassword: undefined, email: undefined, code: undefined },
      user: { email: '', password: '' }, codeLoading: false,
      buttonName: '获取验证码', isDisabled: false, time: 60,
      timestamp: 0,
      rules: {
        userPassword: [
          { required: true, message: '当前密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validMail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    sendCode() {
      this.$refs.form.validateField('email', validate => {
        if (!validate) {
          this.codeLoading = true
          this.buttonName = '验证码发送中'
          const _this = this
          this.codeLoading = false
          this.isDisabled = true
          this.buttonName = this.time-- + '秒后重新发送'
          this.timer = window.setInterval(function() {
            _this.buttonName = _this.time + '秒后重新发送'
            --_this.time
            if (_this.time < 0) {
              _this.buttonName = '重新发送'
              _this.time = 60
              _this.isDisabled = false
              window.clearInterval(_this.timer)
            }
          }, 1000)
        } else {
          return false
        }
      })
    },
    doSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateEmail({ email: this.form.email, verifyCode: this.form.code, password: this.form.userPassword }).then(res => {
            if (res.error === 0) {
              const { data } =res
              this.$message.success(res.msg)
              this.$emit('update-link', 'email', this.form.email,data.isUpdateUsername || false)
              this.resetForm()
              this.codeLoading = false
            }
          })
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      window.clearInterval(this.timer)
      this.time = 60
      this.buttonName = '获取验证码'
      this.isDisabled = false
      this.form = { userPassword: '', email: '', code: '' }
    }
  }
}
</script>

<style scoped>

</style>
