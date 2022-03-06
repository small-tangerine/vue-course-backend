<template>
  <div style="display: inline-block;">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="475px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="新手机号" prop="phone">
          <el-input v-model="form.phone" auto-complete="on" style="width: 200px;" />
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
  name: 'UpdatePhone',
  props: {
    phone: {
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
    const validPhone = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('新手机号不能为空'))
      } else if (value === this.phone) {
        callback(new Error('新手机号不能与原手机号相同'))
      } else {
        callback(new Error('请输入正确的11位手机号'))
      }
    }
    const validPass = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入密码'))
      } else {
        callback(new Error('请输入包含数字、字母或特殊字符的6至15位以上密码'))
      }
    }
    const validCode = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入验证码'))
      } else if (value.trim().length < 4) {
        callback(new Error('请输入四位验证码'))
      } else {
        callback()
      }
    }
    return {
      loading: false, dialog: false, title: '修改手机号', form: { userPassword: '', phone: '', code: '' },
      codeLoading: false,
      buttonName: '获取验证码', isDisabled: false, time: 60,
      timestamp: 0,
      rules: {
        userPassword: [{ required: true, validator: validPass, trigger: 'blur' }],
        phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
        code: [{ required: true, validator: validCode, trigger: 'blur' }]
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
      this.form = { userPassword: '', phone: '', code: '' }
    }
  }
}
</script>

<style scoped>
</style>
