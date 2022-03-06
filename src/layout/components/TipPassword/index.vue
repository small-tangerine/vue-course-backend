<template>
  <el-dialog title="修改——初始密码" :visible.sync="dialogFormVisible" width="30%" :show-close="false">
    <el-form ref="form" :model="user" :rules="rules" label-width="100px">
      <el-form-item :label="$t('profile.oldPassword')" prop="oldPassword">
        <el-input v-model="user.oldPassword" :placeholder="$t('profile.oldPwdTip')" type="password" />
      </el-form-item>
      <el-form-item :label="$t('profile.newPassword')" prop="newPassword">
        <el-input v-model="user.newPassword" :placeholder="$t('profile.newPwdTip')" type="password" />
      </el-form-item>
      <el-form-item :label="$t('profile.confirm')" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" :placeholder="$t('profile.confirmPwdTip')" type="password" />
      </el-form-item>
      <div style="text-align: center">
        <el-button type="primary" size="large" @click="submit">{{ $t('profile.save') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { updateUserPassword } from '@/api/profile'

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
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    name: {
      get: function() {
        return this.$store.state.user.name
      }
    },
    dialogFormVisible: {
      get: function() {
        // console.log(this.$store.state.user)
        return this.$store.state.user.isFirst
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateUserPassword(this.name, this.user.oldPassword, this.user.newPassword).then(
            res => {
              if (res.code === 2000) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.$store.commit('SET_FIRST', false)
              }
            }
          )
        }
      })
    }
  }
}
</script>

