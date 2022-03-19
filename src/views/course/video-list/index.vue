<template>
  <div class="app-container">
    <el-form v-permission="['sys:course:video:query']" v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true"
             @submit.native.prevent>
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键词"
          clearable
          size="small"
          style="width: 240px"
          @clear="clearParams('keyword')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select
          v-model="queryParams.auditStatus"
          placeholder="状态"
          clearable
          size="small"
          style="width: 100px"
          @change="getList"
          @clear="clearParams('auditStatus')"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.payStatus"
            :label="dict.payStatusTitle"
            :value="dict.payStatus"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" size="mini" @click="returnGo">返回</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permission="['sys:course:video:create']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增课程视频
        </el-button>
      </el-col>
      <right-toolbar v-permission="['sys:course:video:query']" :show-search.sync="showSearch" @queryTable="getList"/>
    </el-row>

    <el-table v-loading="loading" :data="videoList">
      <el-table-column label="编号" prop="id" align="center" width="80" :show-overflow-tooltip="true" sortable/>
      <el-table-column label="标题" prop="title" align="center" width="250" :show-overflow-tooltip="true"/>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <el-image style="width:90px;height:50px;border:none;" :src="scope.row.thumbUrl"
                    :preview-src-list="[scope.row.thumbUrl]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="视频保存路径" prop="fileUrl" align="center" width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="视频大小" prop="fileSizeTitle" align="center" width="100" :show-overflow-tooltip="true"/>
      <el-table-column label="视频长度(分钟)" prop="title" align="center" width="120" :show-overflow-tooltip="true">
        <template v-slot="scope">
          {{ scope.row.videoLength | filterSecond }}
        </template>
      </el-table-column>
      <el-table-column label="播放地址" prop="title" align="center" width="80" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span style="color: #409eff;cursor: pointer" @click="playVideo(scope.row)"><i class="el-icon-video-camera"/> </span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="payTypeTitle" align="center" :show-overflow-tooltip="true" width="110">
        <template v-slot="scope">
          <el-popover
            v-if="scope.row.auditStatus === 2"
            placement="top-start"
            width="200"
            trigger="click"
            :content="scope.row.auditNotice">
            <el-tag slot="reference" style="cursor: pointer"
                    :type="scope.row.auditStatus === 0 ? 'warning':(scope.row.auditStatus === 1 ? 'success':'danger')">
              {{ scope.row.auditStatus === 0 ? '未审核' : (scope.row.auditStatus === 1 ? '审核通过' : '审核不通过') }}
            </el-tag>
          </el-popover>
          <el-tag v-else style="cursor: pointer"
                  :type="scope.row.auditStatus === 0 ? 'warning':(scope.row.auditStatus === 1 ? 'success':'danger')">
            {{ scope.row.auditStatus === 0 ? '未审核' : (scope.row.auditStatus === 1 ? '审核通过' : '审核不通过') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="学习人数" prop="learnPersons" align="center" :show-overflow-tooltip="true" width="90" v-if="checkPermission(['sys:course:video:student:query'])">
        <template v-slot="scope">
          <span style="cursor: pointer;color: #409EFF;" v-if="scope.row.learnPersons >0"
                @click="goToStudent(scope.row)">{{ scope.row.learnPersons }}</span>
          <span v-else>{{ scope.row.learnPersons }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="150">
        <template v-slot="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="100">
        <template v-slot="scope">
          <el-button
            v-permission="['sys:course:video:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
          >修改视频
          </el-button>
          <el-button
            v-if="scope.row.auditStatus ===0"
            v-permission="['sys:course:video:audit']"
            size="mini"
            type="text"
            icon="el-icon-document-checked"
            @click.stop="handleAudit(scope.row)"
          >审核视频
          </el-button>
          <el-button
            v-permission="['sys:course:video:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            style="color: #F56C6C"
            @click.stop="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      layout="total, prev, pager, next"
      @pagination="getList"
    />
    <el-dialog title="视频播放" :visible.sync="openVideo" width="700px" @close="cancelVideo">
      <video-player v-if="openVideo" :video="currentData"/>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open" width="700px" @close="cancelOpen" :close-on-click-modal="false" append-to-body >
      <el-form ref="form" :model="form" label-width="100" :rules="rules">
        <el-row :gutter="20" style="height: 160px!important;overflow: hidden">
          <el-col :span="12">
            <el-form-item label="视频标题" style="display: flex" prop="title">
              <el-input :disabled="isAudit" v-model="form.title" type="textarea" placeholder="请输入视频标题"
                        :autosize="{ minRows:6, maxRows: 6}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频封面" prop="thumbUrl" >
              <image-upload ref="bgImg" v-if="form.thumbUrl||isShow" @uploadImage="uploadImage" :type-id="2" :url="form.thumbUrl" :isAudit="isAudit"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="视频" prop="url">
          <el-input type="hidden" v-model="form.url" style="width: 10px"/>
          {{form.url}}
          <el-button type="text" v-if="form.url && (form.url !=='')" @click="playVideo({url:form.url,thumbUrl:form.thumbUrl})" style="margin-left: 20px;"><i class="el-icon-video-camera"/></el-button>
          <video-upload ref="videoUpload" v-if="open && !isAudit" @videoInfo="videoInfo"/>
        </el-form-item>
        <el-form-item label="审核决定" prop="auditStatus" v-if="isAudit">
          <el-select v-model="form.auditStatus" placeholder="请选择审核决定" clearable style="width: 100%">
            <el-option
              v-for="item in auditOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不通过原因" v-if="form.auditStatus===2" prop="auditNotice">
          <el-input v-model="form.auditNotice" type="textarea" placeholder="请输入不通过原因"
                    :autosize="{ minRows: 3, maxRows: 8}"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="submitForm" v-if="isAudit">提交审核</el-button>
        <el-button type="primary" @click="submitForm" v-else>提 交</el-button>
        <el-button @click="cancelOpen">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {addCourseVideo, delCourseVideo, listCourseVideo, updateCourseVideo,courseVideoAudit} from '@/api/course-video'
import {normalSeconds} from "@/utils/utils";
import videoPlayer from '@/components/Video-player'
import imageUpload from '@/components/ImageUpload'
import videoUpload from '@/components/UploadVideo'
export default {
  name: 'Course',
  data() {
    return {
      // 遮罩层
      loading: true,
      currentData: {},
      // 选中数组
      ids: [],
      course: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 是否导出所有数据
      checkAll: false,
      isAudit:false,
      // 总条数
      total: 0,
      // 视频表格数据
      videoList: [],
      // 弹出层标题
      title: '',
      openVideo: false,
      // 是否显示弹出层
      open: false,
      openUpload:false,
      statusOptions: [
        {
          payStatus: 1,
          payStatusTitle: '通过'
        }, {
          payStatus: 0,
          payStatusTitle: '未审核'
        },
        {
          payStatus: 2,
          payStatusTitle: '不通过'
        }],
      id: undefined,
      // 查询参数
      auditOptions:[
        {
          value:1,
          label:'通过'
        },{
          value: 2,
          label: '不通过'
        }
      ],
      queryParams: {
        page: 1,
        pageSize: 10,
        keyword: undefined,
        auditStatus: undefined
      },
      isShow:false,
      // 表单参数
      form: {
        title:undefined,
        thumbUrl:'http://localhost/image/default.png',
        url:undefined,
        auditStatus:undefined,
        auditNotice: undefined
      },
      // 表单校验
      rules:{
        title:[{required:true,message:'请输入视频标题',trigger:'blur'}],
        url:[{required:true,message:'请上传课程视频',trigger:'change'}],
        auditStatus: [{required:true,message:"请选择审核决定",trigger:'change'}],
        auditNotice:  [{required:true,message:"请输入审核不通过原因",trigger:'blur'}]
      }
    }
  },
  components: {
    videoPlayer,
    imageUpload,
    videoUpload
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.id = id
      this.queryParams.courseId = id
      this.getList()
    } else {
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.replace({path: '/course/course-list'})
    }
  },
  methods: {
    videoInfo(item){
      // console.log(item)
      this.form.url=item.url
      this.form.fileUrl=item.fileUrl
      this.form.fileSize=item.fileSize
      this.form.videoLength=item.videoLength
    },
    allRemove(){
      this.$refs.videoUpload.allRemove()
    },
    returnGo() {
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.replace({path: '/course/course-list'})
    },
    cancelUpload(){
      this.openUpload=false
    },
    goToStudent(row) {
      this.$router.push({
        path: '/course/video-student-list', query: {
          id: row.id
        },
        replace: true
      })
    },
    handleAudit(row) {
      this.title="审核视频"
      this.open=true
      Object.assign( this.form ,row)
      this.form.auditStatus=1
      this.isAudit=true
    },
    uploadImage(url){
      if (url)
      {
        this.form.thumbUrl=url
      }else {
        this.form.thumbUrl=url
        this.isShow=true
      }
    },
    playVideo(row) {
      this.openVideo = true
      this.currentData = row
    },
    cancelOpen() {
      this.open = false
      this.form={
        title:undefined,
        url:undefined,
        auditStatus:undefined,
        auditNotice: undefined
      }
      this.isAudit=false
      this.isShow=false
      this.$refs.form.resetFields()
    },
    cancelVideo() {
      this.openVideo = false
    },
    /** 查询视频列表 */
    getList() {
      this.loading = true
      listCourseVideo(this.queryParams).then(
        res => {
          if (res.error === 0) {
            const {data} = res || []
            const {items, totalCount} = data || []
            this.videoList = items || []
            this.total = totalCount || 0
            this.loading = false
          }
        }
      ).catch(() => {
        this.loading = false
        this.total = 0
        this.videoList = []
      })
    },
    // 置空参数
    clearParams(val) {
      this.queryParams[val] = undefined
      this.handleQuery()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.queryParams.courseId = this.id
      this.handleQuery()
    },
    handleAdd() {
      this.open = true
      this.form.courseId=this.id
      this.form.thumbUrl='http://localhost/image/default.png'
      this.title="添加课程视频"
      this.isShow=false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
     Object.assign( this.form ,row)
      this.title="修改课程视频"
      this.isShow=false
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isAudit){
            this.isShow=false
            courseVideoAudit(this.form).then(res=>{
              if (res.error===0){
                this.$message.success(res.msg)
                this.open = false
                this.getList()
              }
            })
            return
          }
          if (this.form.id !== undefined) {
            updateCourseVideo(this.form).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          } else {
            this.form.menuCollect = undefined
            this.form.resourceCollect = undefined
            addCourseVideo(this.form).then(res => {
              if (res.error === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const courseIds = row.id
      this.$confirm('确认删除视频编号为"' + courseIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delCourseVideo(row.id)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
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
<style lang="scss" scoped>

.el-checkbox {
  margin-left: 5px;

  .el-checkbox__label {
    padding-left: 0 !important;
  }

}

</style>
