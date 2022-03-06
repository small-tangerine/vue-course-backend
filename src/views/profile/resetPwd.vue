<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="140px">
    <el-form-item :label="$t('profile.oldPassword')" prop="oldPassword">
      <el-input v-model="user.oldPassword" :placeholder="$t('profile.oldPwdTip')" type="password" />
    </el-form-item>
    <el-form-item :label="$t('profile.newPassword')" prop="newPassword">
      <el-input v-model="user.newPassword" :placeholder="$t('profile.newPwdTip')" type="password" />
    </el-form-item>
    <el-form-item :label="$t('profile.confirm')" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" :placeholder="$t('profile.confirmPwdTip')" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('profile.save') }}</el-button>
      <el-button type="danger" size="mini" @click="close">{{ $t('profile.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          {
            pattern: '^(?![A-Z]+$)(?![a-z]+$)(?!\\d+$)(?![\\W_]+$)\\S{6,15}$',
            message: '请输入包含数字、字母或特殊字符的6至15位以上密码',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          return true
        }
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>
