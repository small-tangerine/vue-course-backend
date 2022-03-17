<template>
  <div class="app-container">
    <el-descriptions class="margin-top" title="讲师信息" :column="4" border style="margin-bottom: 5px">

      <template slot="extra">
        <el-button type="info" size="mini" @click="handleUpdate">修改</el-button>
        <el-button type="primary" size="mini" @click="returnUser">返回</el-button>
      </template>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          <i class="el-icon-picture-outline"></i>
          讲师头像
        </template>
        <el-image style="width:40px;height:40px;border:none;" :src="teacher.avatar"
                  :preview-src-list="[teacher.avatar]"></el-image>

      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          <i class="el-icon-user"></i>
          讲师名称
        </template>
        {{ teacher.name || '未设置' }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          <i class="el-icon-suitcase-1"></i>
          职位
        </template>
        {{ teacher.job || '未设置' }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          讲师简介
        </template>
        {{ teacher.introduction || '未设置' }}
      </el-descriptions-item>

    </el-descriptions>
    <!-- 分配角色对话框 -->
    <el-dialog title="修改讲师信息" :visible.sync="openUpdate" width="500px" append-to-body :before-close="cancelUpdate">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="讲师头像" prop="avatar" style="display: flex;align-items: center">
          <avatar :avatar="form.avatar" @updateAvatar="updateAvatar"/>
        </el-form-item>
        <el-form-item label="讲师名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入讲师名称"/>
        </el-form-item>
        <el-form-item label="讲师职位" prop="job">
          <el-input v-model="form.job" placeholder="请输入职位"/>
        </el-form-item>
        <el-form-item label="讲师简介" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容"  :autosize="{ minRows: 1, maxRows: 6}"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTeacher">确 定</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
      </div>
    </el-dialog>
    <course-list :userId="userId"/>
  </div>
</template>

<script>
import courseList from '@/views/system/user/teacher/course-list'
import {getTeacherInfo,updateTeacherInfo} from '@/api/system/user'
import Avatar from '@/components/Avatar'
export default {
  components: {courseList,Avatar},
  data() {
    return {
      teacher: {},
      avatar:undefined,
      openUpdate:false,
      userId: undefined,
      form:{
        name:undefined,
        avatar:undefined,
        job:undefined,
        introduction:undefined
      },
      rules: {
        name: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '用户角色不能为空', trigger: 'blur' }
        ]
      },
    };
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    console.log(id)
    if (id) {
      this.userId = id-0
      this.teacherInfo(id)
    }
  }, methods: {
    handleUpdate() {
      Object.assign(this.form,this.teacher)
      this.openUpdate=true
    },
    cancelUpdate(){
      this.$refs.form.clearValidate()
      this.openUpdate=false
    },
    submitTeacher(){
       this.$refs.form.validate(valid=>{
         if (valid){
           updateTeacherInfo(this.form).then(res=>{
             if (res.error === 0){
               this.$message.success(res.msg)
               this.cancelUpdate()
               this.teacherInfo(this.userId)
             }
           })
         }
       })
    },
    updateAvatar(url){
      this.form.avatar =url
    },
    teacherInfo(id) {
      getTeacherInfo(id).then(res => {
        if (res.error === 0) {
          const {data} = res || []
          this.teacher = data || {}
        } else {
          this.returnUser()
        }
      }).catch(() => {
        this.teacher = {}
        this.returnUser()
      })
    },
    returnUser() {
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.replace({path: '/system/user-list'})
    },
  }
}
</script>
