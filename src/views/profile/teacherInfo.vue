<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="100px">
    <el-form-item label="讲师名称" prop="name">
      <el-input v-model="user.name" style="width: 50%"  placeholder="请输入讲师名称"/>
    </el-form-item>
    <el-form-item label="讲师职位" prop="job">
      <el-input v-model="user.job" style="width: 50%"  placeholder="请输入讲师职位"/>
    </el-form-item>
    <el-form-item label="讲师简介" prop="introduction">
    <el-input v-model="user.introduction" style="width: 70%" type="textarea" placeholder="请输入内容"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('profile.save') }}</el-button>
      <el-button type="danger" size="mini" @click="close">{{ $t('profile.close') }}</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import UpdateEmail from '@/views/profile/components/updateEmail'
import UpdatePhone from '@/views/profile/components/updatePhone'
import { updateTeacherInfo } from '@/api/user'
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
        name: [
          { required: true, message: '讲师名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateTeacherInfo({job:this.user.job,name: this.user.name,introduction:this.user.introduction}).then(res =>{
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
