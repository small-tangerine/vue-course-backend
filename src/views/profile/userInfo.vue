<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="100px">
    <el-form-item :label="$t('profile.nickName')" prop="nickname">
      <el-input v-model="user.nickname" style="width: 50%" />
    </el-form-item>
    <el-form-item :label="$t('profile.phone')" prop="mobile">
      <span>{{ user.mobile }}</span>
      <span>  <a @click="$refs.phone.dialog = true">修改手机</a></span>
    </el-form-item>
    <el-form-item :label="$t('profile.email')" prop="email">
      <span>{{ user.email }}</span>
      <span>
        <a @click="$refs.email.dialog = true">修改邮箱</a>
      </span>
    </el-form-item>
    <el-form-item :label="$t('profile.sex')">
      <el-radio-group v-model="user.sex">
        <span>{{ typeof (user.sex) }}</span>
        <el-radio label="unknown">{{ $t('profile.unknown') }}</el-radio>
        <el-radio label="male">{{ $t('profile.man') }}</el-radio>
        <el-radio label="female">{{ $t('profile.female') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('profile.save') }}</el-button>
      <el-button type="danger" size="mini" @click="close">{{ $t('profile.close') }}</el-button>
    </el-form-item>
    <update-email ref="email" :email="user.email" @update-link="changeNew" />
    <update-phone ref="phone" :phone="user.mobile" @update-link="changeNew" />
  </el-form>

</template>

<script>
import UpdateEmail from '@/views/profile/components/updateEmail'
import UpdatePhone from '@/views/profile/components/updatePhone'
import { updateBaseInfo } from '@/api/user'
export default {
  components: { UpdatePhone, UpdateEmail },
  props: {
    user: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        nickname: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateBaseInfo({sex:this.user.sex,nickname: this.user.nickname}).then(res =>{
            if (res.error === 0){
              this.$message.success(res.msg)
            }
          })
        }
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/dashboard' })
    },
    changeNew(type, link,isUpdateUsername) {
      this.$emit('change-link', type, link,isUpdateUsername)
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item__content {
  float: left;
  a{
    margin-left: 5px;
    color: #317EF3;
  }
}
</style>
