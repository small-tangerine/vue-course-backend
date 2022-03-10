<template>
  <div class="app-container">
<el-descriptions class="margin-top" title="讲师信息" :column="4"  border style="margin-bottom: 5px">

    <template slot="extra">
      <el-button type="primary"  size="mini" @click="returnUser">返回</el-button>
    </template>
    <el-descriptions-item  :contentStyle="{'text-align': 'center'}">
      <template slot="label">
        <i class="el-icon-picture-outline"></i>
        讲师头像
      </template>
         <el-image style="width:40px;height:40px;border:none;" :src="teacher.avatar"
                    :preview-src-list="[teacher.avatar]"></el-image>

    </el-descriptions-item>
    <el-descriptions-item  :contentStyle="{'text-align': 'center'}">
      <template slot="label">
        <i class="el-icon-user"></i>
        讲师名称
      </template>
      {{teacher.name || '未设置'}}
    </el-descriptions-item>
    <el-descriptions-item :span="2"  :contentStyle="{'text-align': 'center'}">
      <template slot="label">
        <i class="el-icon-suitcase-1"></i>
        职位
      </template>
      {{teacher.job || '未设置'}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-s-custom"></i>
        讲师简介
      </template>
      {{teacher.introduction || '未设置'}}
    </el-descriptions-item>

</el-descriptions>
  <course-list/>
  </div>
</template>

<script>
import courseList from '@/views/system/user/teacher/course-list'
import { getTeacherInfo } from '@/api/system/user'
export default {
  components:{courseList},
  data () {
    return {
      teacher:{},
    };
  },
  created(){
    const id = this.$route.query && this.$route.query.id
    console.log(id)
    if (id){
      this.teacherInfo(id)
    }
  },methods:{
    teacherInfo(id)
    {
      getTeacherInfo(id).then(res=>{
        if (res.error === 0){
          const { data } = res || []
          this.teacher = data || {}
        }else {
          this.returnUser()
        }
      }).catch(()=>{
        this.teacher = {}
        this.returnUser()
      })
    },
    returnUser(){
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.replace({ path: '/system/user-list' })
    },
  }
}
</script>
