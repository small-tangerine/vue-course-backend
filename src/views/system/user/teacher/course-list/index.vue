<template>
  <!-- 分类列表 -->
  <el-row :gutter="10">

    <el-col :xs="30" :sm="30" :md="15" :lg="24" :xl="24" style="margin-top: 20px">
      <el-card class="box-card">
        <el-descriptions class="margin-top" title="讲师课程"/>
        <el-form v-permission="['sys:course:query']" v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true"
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
          <el-form-item label="课程类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="类型"
              clearable
              size="small"
              style="width: 80px"
              @change="getList"
              @clear="clearParams('type')"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.payType"
                :label="dict.payTypeTitle"
                :value="dict.payType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否折扣" prop="isDiscount">
            <el-select
              v-model="queryParams.isDiscount"
              placeholder="折扣"
              clearable
              size="small"
              style="width: 80px"
              @change="getList"
              @clear="clearParams('isDiscount')"
            >
              <el-option
                v-for="dict in isDiscountOptions"
                :key="dict.isDiscount"
                :label="dict.isDiscountTitle"
                :value="dict.isDiscount"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar v-permission="['sys:course:query']" :show-search.sync="showSearch" @queryTable="getList"/>
        </el-row>

        <el-table v-loading="loading" :data="courseList">
          <el-table-column label="编号" prop="id" align="center" width="80" :show-overflow-tooltip="true" sortable/>
          <el-table-column label="标题" prop="title" align="center" width="350" :show-overflow-tooltip="true"/>
          <el-table-column label="封面" align="center" >
            <template slot-scope="scope">
              <el-image style="width:90px;height:50px;border:none;" :src="scope.row.banner"
                        :preview-src-list="[scope.row.banner]"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="note" align="center" :show-overflow-tooltip="true" width="90">
            <template v-slot="scope">
              <el-tag :type="scope.row.type === 2 ? 'success':'info'" >{{ scope.row.type === 1 ? '免费课程':'付费课程' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="课程原价" prop="price" align="center" :show-overflow-tooltip="true" width="90"/>
          <el-table-column label="是否折扣" prop="email" align="center" >
            <template v-slot="scope">
              <el-tag :type="scope.row.isDiscount === 1 ? 'success':'danger'" >{{scope.row.isDiscount === 1?'是':'否'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="折扣价" prop="discountPrice" align="center" :show-overflow-tooltip="true" width="90"/>
          <el-table-column label="审核状态" prop="payTypeTitle" align="center" :show-overflow-tooltip="true" width="110">
            <template v-slot="scope">
              <el-popover
                v-if="scope.row.auditStatus === 2"
                placement="top-start"
                width="200"
                trigger="click"
                :content="scope.row.auditNotice">
                <el-tag slot="reference" style="cursor: pointer" :type="scope.row.auditStatus === 0 ? 'warning':(scope.row.auditStatus === 1 ? 'success':'danger')" >
                  {{scope.row.auditStatus === 0 ? '未审核':(scope.row.auditStatus === 1 ? '审核通过':'审核不通过')}}</el-tag>
              </el-popover>
              <el-tag v-else style="cursor: pointer" :type="scope.row.auditStatus === 0 ? 'warning':(scope.row.auditStatus === 1 ? 'success':'danger')" >
                {{scope.row.auditStatus === 0 ? '未审核':(scope.row.auditStatus === 1 ? '审核通过':'审核不通过')}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="学习人数" prop="learnPersons" align="center" :show-overflow-tooltip="true" width="90">
            <template v-slot="scope">
              <span style="cursor: pointer;color: #409EFF;" v-if="scope.row.learnPersons >0" @click="goToStudent(scope.row)">{{scope.row.learnPersons}}</span>
              <span v-else>{{scope.row.learnPersons}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdAt" width="150" >
            <template v-slot="scope">
              <span>{{ scope.row.createdAt }}</span>
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
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {
  listCourse,
} from '@/api/course'

export default {
  name: 'Course',
  props:{
    userId:{
      type:Number,
      require:true
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 总条数
      total: 0,
      // 课程表格数据
      courseList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（分配权限）
      openDataScope: false,
      openMenuScope: false,
      menuExpand: false,
      menuNodeAll: false,
      resourceExpand: false,
      resourceNodeAll: false,
      statusOptions:[
        {
          payStatus: 1,
          payStatusTitle: '通过'
        },{
          payStatus: 0,
          payStatusTitle: '未审核'
        },
        {
          payStatus: 2,
          payStatusTitle: '不通过'
        }],
      typeOptions:[{
        payType: 1,
        payTypeTitle: '免费'
      },
        {
          payType: 2,
          payTypeTitle: '付费'
        },],
      isDiscountOptions:[{
        isDiscount: 1,
        isDiscountTitle: '是'
      },
        {
          isDiscount: 0,
          isDiscountTitle: '否'
        },],
      // 日期范围
      dateRange: [],
      unFree:0,
      free:0,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        keyword: undefined,
        auditStatus:undefined,
        type:undefined,
        isDiscount:undefined,
        userId:undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.queryParams.userId=this.userId
    this.getList()
  },
  methods: {
    goToStudent(row){
      this.$router.push({path:'/course/student-list', query: {
          id: row.id},
        replace: true})
    },
    handleView(row){
      this.$router.push({path:'/course/detail', query: {
          id: row.id,code:row.code},
        replace: true})
    },
    handleAudit(row){
      this.$router.push({path:'/course/detail/audit', query: {
          id: row.id,code:row.code},
        replace: true})
    },
    /** 查询课程列表 */
    getList() {
      this.loading = true
      listCourse(this.queryParams).then(
        res => {
          if (res.error === 0) {
            const { data } = res || []
            const { items, totalCount ,extra} = data || []
            this.courseList = items || []
            this.total = totalCount || 0
            const {free,unFree} = extra || []
            this.unFree=unFree || 0
            this.free = free || 0
            this.loading = false
          }
        }
      ).catch(() => {
        this.loading = false
        this.total = 0
        this.courseList = []
      })
    },
    // 置空参数
    clearParams(val) {
      this.queryParams[val] = undefined
      this.handleQuery()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.$refs['form'].clearValidate()
      this.reset()
    },
    // 取消按钮（分配权限）
    cancelDataScope(val) {
      if (val === 'menu') {
        this.openMenuScope = false
      }
      if (val === 'resource') {
        this.openDataScope = false
      }
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      if (this.$refs.resource !== undefined) {
        this.$refs.resource.setCheckedKeys([])
      }
      this.menuExpand = false
      this.menuNodeAll = false
      this.resourceExpand = false
      this.resourceNodeAll = false
      this.form = {
        id: undefined,
        title: undefined,
        menuCollect: [],
        resourceCollect: [],
        note: ''
      }
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
      this.handleQuery()
    }
  }
}
</script>
