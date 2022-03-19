<template>
  <div class="app-container">
    <el-descriptions direction="vertical" title="添加课程">
      <template slot="extra">
        <el-button type="primary" @click="checkSubmitCourse" v-permission="['sys:course:update']">提交</el-button>
        <el-button type="info" size="mini" @click="resetForm">重置</el-button>
        <el-button size="mini" @click="returnGo">返回</el-button>
      </template>
    </el-descriptions>
    <el-form ref="form" :model="courseForm" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="课程名称" prop="title">
            <el-input type="textarea" v-model="courseForm.title" placeholder="请输入课程名称"
                      :autosize="{ minRows: 1, maxRows: 6}"/>
          </el-form-item>
          <el-form-item label="课程类型" prop="type">
            <el-select v-model="courseForm.type" placeholder="请选择课程类型" clearable style="width: 100%">
              <el-option
                v-for="item in typeOptions"
                :key="item.type"
                :label="item.title"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="courseForm.type===2" prop="isDiscount" label="是否折扣">
            <el-select v-model="courseForm.isDiscount" placeholder="请选择" clearable style="width: 100%">
              <el-option
                v-for="item in isOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="recommend" label="首页推荐">
            <el-select v-model="courseForm.recommend" placeholder="请选择" clearable style="width: 100%">
              <el-option
                v-for="item in recommendOptions"
                :key="item.value"
                :disabled="item.value ===1 &&courseForm.type===1"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in extra.tips"
            :label="'课程须知' + (index+1)"
            :key="index">
            <el-input v-model="domain.value" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 1, maxRows: 6}"
                      style="width: 95%"/>
            <i class="el-icon-circle-plus-outline" v-if="index===0" @click.prevent="addDomain('tips','课程须知最多六点',6)"
               style=" cursor: pointer;   margin-left: 5px;
    margin-top: 12px;
    position: absolute;"/>
            <i class="el-icon-remove-outline" v-else @click.prevent="removeDomain(domain,'tips')" style="cursor: pointer;     margin-left: 5px;
    margin-top: 12px;
    position: absolute;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="课程分类" prop="categoryIds">
            <el-cascader
              style="width: 100%"
              v-model="courseForm.categoryIds"
              placeholder="请选择分类"
              :options="options"
              :props="{ multiple: true,emitPath:false,value:'id',label:'title' }"
              @change="changeCategory"
              clearable
              filterable></el-cascader>
          </el-form-item>
          <el-form-item v-if="courseForm.type===2" label="课程价格" prop="price">
            <el-input v-model="courseForm.price" placeholder="请输入课程价格"/>
          </el-form-item>
          <el-form-item v-if="courseForm.isDiscount===1" label="折扣价格" prop="discountPrice">
            <el-input v-model="courseForm.discountPrice" placeholder="请输入课程折扣价格"/>
          </el-form-item>
          <el-form-item label="是否完结" prop="isFinish">
            <el-select v-model="courseForm.isFinish" placeholder="请选择" clearable style="width: 100%">
              <el-option
                v-for="item in isOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in extra.learn"
            :label="'学到什么' + (index+1)"
            :key="index">
            <el-input v-model="domain.value" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 1, maxRows: 6}"
                      style="width: 95%"/>
            <i class="el-icon-circle-plus-outline" v-if="index===0" @click.prevent="addDomain('learn','学到什么最多10点',10)"
               style="cursor: pointer;     margin-left: 5px;
    margin-top: 12px;
    position: absolute;"/>
            <i class="el-icon-remove-outline" v-else @click.prevent="removeDomain(domain,'learn')" style="cursor: pointer;     margin-left: 5px;
    margin-top: 12px;
    position: absolute;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="课程别名" prop="alias">
            <el-input v-model="courseForm.alias" placeholder="请输入课程别名"
                      :autosize="{ minRows: 1, maxRows: 6}"/>
          </el-form-item>
          <el-form-item label="课程简介" prop="introduction">
            <el-input v-model="courseForm.introduction" type="textarea" placeholder="请输入内容"
                      :autosize="{ minRows: 3, maxRows: 8}"/>
          </el-form-item>
          <el-form-item label="课程封面">
            <el-input type="hidden" v-model="courseForm.banner" style="position: absolute"/>
            <image-upload ref="banner"  v-if="courseForm.banner|| isShow" @uploadImage="uploadImage" :type-id="1" :url="courseForm.banner"/>
          </el-form-item>
          <el-form-item label="课程详情背景">
            <el-input type="hidden" v-model="courseForm.bgImg" style="position: absolute"/>
            <image-upload ref="bgImg" v-if="courseForm.bgImg ||isShow"  @uploadImage="uploadImage" :type-id="2" :url="courseForm.bgImg"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload'
import {courseView, updateCourse} from "@/api/course";
import {getCategorySelect} from "@/api/course/category";

export default {
  name: "edit",
  components: {
    ImageUpload
  },
  data() {
    return {
      extra: {
        tips: [{value: '', key: Date.now()}],
        learn: [{value: '', key: Date.now()}]
      },
      isShow:false,
      options: [],
      courseForm: {
        title: undefined,
        alias: undefined,
        introduction: undefined,
        type: undefined,
        price: undefined,
        isFinish:undefined,
        isDiscount: undefined,
        discountPrice: undefined,
        recommend: undefined,
        categoryIds: []
      },
      thisData:{},
      categoryIds: [],
      recommendOptions: [{
        value: 1,
        label: "实战推荐"
      }, {
        value: 2,
        label: "新上好课"
      }],
      typeOptions: [{
        type: 1,
        title: "免费"
      },
        {
          type: 2,
          title: '付费'
        }],
      isOptions: [{
        value: 1,
        label: "是"
      },
        {
          value: 0,
          label: '否'
        }],
      rules: {
        title: [{required: true, message: '课程名称不能为空', trigger: 'blur'}],
        type: [{required: true, message: '课程类型不能为空', trigger: 'change'}],
        isDiscount: [{required: true, message: '请选择是否折扣', trigger: 'change'}],
        categoryIds: [{required: true, message: '请选择课程分类', trigger: 'change'}],
        discountPrice: [{required: true, message: '请输入折扣价格', trigger: 'blur'}],
        price: [{required: true, message: '请输入课程价格', trigger: 'blur'}]
      }
    }
  },
  created() {
    getCategorySelect().then(res => {
      if (res.error === 0) {
        const {data} = res || {}
        this.options = data || []
      }
    })
    this.courseForm.id=this.$route.query &&this.$route.query.id
    if (!this.courseForm.id){
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.replace({path: '/course/course-list'})
      return
    }
    this.courseDetail(this.courseForm.id)
  },
  methods: {
    courseDetail(id){
      courseView({id:id}).then(res=>{
        if (res.error===0){
          const {data} = res ||{}
          Object.assign(this.courseForm,data||{})
          if (!data.banner || data.banner==='' ||!data.bgImg || data.bgImg==='' ){
            this.isShow=true
          }
          const tips = data.tipList||[]
          tips.forEach((item,index)=>{
            if (index ===0)
            {
              this.extra.tips[0].value=item
              return
            }
            this.extra.tips.push({value: item,key:Date.now() })
          })
          const learnList = data.learnWhatList||[]
          learnList.forEach((item,index)=>{
            if (index ===0)
            {
              this.extra.learn[0].value=item
              return
            }
            this.extra.learn.push({value: item,key:Date.now() })
          })
          this.thisData =data
        }
      })
    },
    uploadImage(url, type) {
      if (type === 1) {
        this.courseForm.banner = url
      }
      if (type === 2) {
        this.courseForm.bgImg = url
      }
    },
    removeDomain(item, val) {
      const index = this.extra[val].indexOf(item)
      if (index !== -1) {
        this.extra[val].splice(index, 1)
      }
    },
    changeCategory(val) {
      this.categoryIds = val
    },
    addDomain(val, tip, length) {
      if (this.extra[val].length >= length) {
        this.$message.warning(tip)
        return
      }
      this.extra[val].push({
        value: '',
        key: Date.now()
      });
    },
    resetForm() {
      this.courseForm={
        title: undefined,
        alias: undefined,
        introduction: undefined,
        type: undefined,
        price: undefined,
        isFinish:undefined,
        isDiscount: undefined,
        discountPrice: undefined,
        recommend: undefined,
        categoryIds: [],
      }
      Object.assign(this.$data.extra, this.$options.data().extra)
      let flag=0
      const  fileList = this.$refs.banner.fileList||[]
      fileList.forEach(item=>{
        if (item.url === this.thisData.banner){
          flag=1
        }
      })
      if (flag===0)
      {
        this.$refs.banner.setFileList(this.thisData.banner)
      }
      let flag1=0
      const  fileList1 = this.$refs.bgImg.fileList||[]
      fileList1.forEach(item=>{
        if (item.url === this.thisData.bgImg){
          flag1=1
        }
      })
      if (flag1===0)
      {
        this.$refs.bgImg.setFileList(this.thisData.bgImg)
      }
      const tips = this.thisData.tipList||[]
      tips.forEach((item,index)=>{
        if (index ===0)
        {
          this.extra.tips[0].value=item
          return
        }
        this.extra.tips.push({value: item,key:Date.now() })
      })
      const learnList = this.thisData.learnWhatList||[]
      learnList.forEach((item,index)=>{
        if (index ===0)
        {
          this.extra.learn[0].value=item
          return
        }
        this.extra.learn.push({value: item,key:Date.now() })
      })
      this.$refs.form.resetFields()
      Object.assign(this.courseForm ,this.thisData)
    },
    checkSubmitCourse(){
      this.$confirm('提交更新课程将重新审核', '警告', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.submitCourse()
      })
    },
    submitCourse() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const form = Object.assign({}, this.courseForm)
          form.tipList = this.getValue(this.extra.tips)
          form.learnWhatList = this.getValue(this.extra.learn)
          form.categoryIds = this.categoryIds
          updateCourse(form).then(res => {
            if (res.error === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$store.dispatch('tagsView/delView', this.$route);
              this.$router.replace({path: '/course/course-list'})
            }
          })
        }
      })
    },
    getValue(item) {
      return item.map(item => {
        return item.value
      })
    },
    returnGo() {
      this.$confirm('确定要放弃当前编辑的信息吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('tagsView/delView', this.$route);
        this.$router.replace({path: '/course/course-list'})
      })
    },
  }
}
</script>
<style scoped>

</style>
