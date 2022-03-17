<template>
  <div class="app-container">
    <el-descriptions v-if="course && course.id" class="margin-top" direction="vertical" title="课程信息详情" :column="4"
                     border>

      <template slot="extra">
        <el-button v-if="status===0"    v-permission="['sys:course:audit']" type="danger" size="large" @click="openAudit" style="margin-right: 20px">审核</el-button>
        <el-button type="primary" size="mini" @click="returnGo">返回</el-button>
      </template>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程名称
        </template>
        {{ course.title }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程别名
        </template>
        {{ course.alias }}
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程审核状态
        </template>
        <el-tag :type="course.auditStatus === 0 ? 'warning':(course.auditStatus === 1 ? 'success':'danger')">
          {{ course.auditStatusTitle }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label">
          课程审核备注
        </template>
        {{ course.auditNotice || '暂无' }}
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程封面
        </template>
        <el-image v-if="course.banner" style="width:90px;height:50px;border:none;" :src="course.banner"
                  :preview-src-list="[course.banner]"></el-image>
        <span v-else>未设置</span>
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程背景
        </template>
        <el-image v-if="course.bgImg" style="width:90px;height:50px;border:none;" :src="course.bgImg"
                  :preview-src-list="[course.bgImg]"></el-image>
        <span v-else>未设置</span>
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程类型
        </template>
        <el-tag :type="course.type === 2 ? 'success':'info'">{{ course.typeTitle }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          学习人数
        </template>
        {{ course.learnPersons || 0 }}
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程是否完结
        </template>
        {{ course.isFinish === 1 ? '已完结' : '未完结' }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          课程原价
        </template>
        <span v-if="course.type ===2">{{ course.price ? '￥'+course.price:'未设置' }}</span>
        <span v-else>无</span>
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          是否折扣
        </template>
        {{ course.isDiscount === 1 ? '是' : '否' }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}">
        <template slot="label">
          折扣价格
        </template>
        {{ course.discountPrice ? '￥'+course.discountPrice:'无' }}
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'white-space': 'pre-line'}">
        <template slot="label">
          课程须知
        </template>
        {{ course.tip || '未设置' }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'white-space': 'pre-line'}">
        <template slot="label">
          能学到什么
        </template>
        {{ course.learnWhat || '未设置' }}
      </el-descriptions-item>
      <el-descriptions-item :contentStyle="{'text-align': 'left'}">
        <template slot="label">
          课程讲师
        </template>
        <span v-if="course && course.teacher">
           <span>讲师名称： {{ course.teacher.name || '未设置' }}</span><br>
           <span>讲师职位： {{ course.teacher.job || '未设置' }}</span><br>
           <span>讲师简介： {{ course.teacher.introduction || '未设置' }}</span>
        </span>
        <span v-else>暂无</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'text-align': 'left'}">
        <template slot="label">
          课程视频 ({{ course.videoCount || 0 }})
        </template>
        <span v-if="course.video && (course.video || []).length>0">
          <span v-for="(item,index) in course.video"
                :key="index"> {{ index+1 }}、{{ item.title }}({{ (item.videoLength || 0) | filterSecond }})&nbsp;
           <el-tag :type="item.auditStatus === 0 ? 'warning':(item.auditStatus === 1 ? 'success':'danger')">
             {{ item.auditStatus === 2 ? (item.auditNotice || '视频违规') : item.auditStatusTitle }}
           </el-tag><br>
          </span>
        </span>
        <span v-else>暂无</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2" :contentStyle="{'text-align': 'left'}">
        <template slot="label">
          课程分类
        </template>
        <span v-if="course.categoryStr && (course.categoryStr || []).length>0">
          <span v-for="(item,index) in course.categoryStr"
                :key="index">&nbsp;
           <el-tag >
             {{ item }}
           </el-tag><br>
          </span>
        </span>
        <span v-else>暂无</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          课程简介
        </template>
        {{ course.introduction || '未设置' }}
      </el-descriptions-item>

    </el-descriptions>
    <empty v-else>
      <template slot="info">
        <div style="margin-top: 15px;color: #97a8be;cursor: pointer"><span @click="returnGo">返回上一页</span></div>
      </template>
    </empty>
    <el-dialog title="课程审核" :visible.sync="open" width="400px">
      <el-form ref="form" :model="auditForm" label-width="100" :rules="rules">
        <el-form-item label="审核决定" prop="auditStatus">
          <el-select v-model="auditForm.auditStatus" placeholder="请选择审核决定" clearable style="width: 100%">
            <el-option
              v-for="item in auditOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不通过原因" v-if="auditForm.auditStatus===2" prop="auditNotice">
          <el-input v-model="auditForm.auditNotice" type="textarea" placeholder="请输入不通过原因"
                    :autosize="{ minRows: 3, maxRows: 8}"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submitAudit">提交审核</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {courseAudit, courseDetail} from "@/api/course";
import empty from "@/components/Empty/empty";
import {normalSeconds} from "@/utils/utils";

export default {
  name: "index",
  components: {
    empty
  },
  data() {
    return {
      course: {},
      status:1,
      open:false,
      auditOptions:[
        {
          value:1,
          label:'通过'
        },{
        value: 2,
          label: '不通过'
        }
      ],
      id:undefined,
      auditForm:{
        id:undefined,
        auditStatus:undefined,
        auditNotice:undefined
      },
      rules:{
        auditStatus: [{required:true,message:"请选择审核决定",trigger:'change'}],
        auditNotice:  [{required:true,message:"请输入审核不通过原因",trigger:'blur'}]
      }
    }
  },
  created() {
    this.id = this.$route.query && this.$route.query.id
    this.status= this.$route.query && this.$route.query.status
    this.getDetail(this.id)
  },
  methods: {
    returnGo() {
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.replace({path: '/course/course-list'})
    },
    openAudit(){
      this.open=true
    },
    submitAudit(){
        this.$refs.form.validate(validate =>{
          if (validate){
            this.auditForm.id=this.id
            courseAudit(this.auditForm).then(res=>{
              if (res.error ===0){
                this.$message.success(res.msg)
                this.returnGo()
              }
            })
          }
        } )
    },
    cancelAudit(){
      this.$refs.form.resetFields()
      this.open=false
    },
    getDetail(id) {
      courseDetail({id: id}).then(res => {
        // console.log(res)
        if (res.error === 0) {
          const {data} = res || {}
          this.course = data || {}
        }
      })
    }
  },
  filters: {
    filterSecond(val) {
      return normalSeconds(val)
    }
  }
}
</script>

<style scoped>

</style>
