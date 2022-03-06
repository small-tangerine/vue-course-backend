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
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
        <el-button type="text" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UpdateEmail',
  props: {
    email: {
      type: String,
      required: true,
      default: ''
    },
    username: {
      type: String,
      required: true,
      default: ''
    },
    userId: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('新邮箱不能为空'))
      } else if (value === this.email) {
        callback(new Error('新邮箱不能与旧邮箱相同'))
      } else {
        callback(new Error('邮箱格式错误'))
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
    },
    doSubmit() {
      this.$refs['form'].validate(valid => {
        return !!valid
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
