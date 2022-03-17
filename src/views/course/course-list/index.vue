<template>
  <div class="app-container">
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
      <el-col :span="1.5">
        <el-button
          v-permission="['sys:course:create']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增课程
        </el-button>
      </el-col>
      <el-col v-if="free > 0" style="margin-left: 50px;margin-top: 5px;width: 200px"><span style="font-weight: bold">免费课程：{{free}}门</span></el-col>
      <el-col  v-if="unFree > 0"  style="margin-top: 5px;width: 200px"><span style="color: #ff4949; font-weight: bold">付费课程： {{unFree}}门</span></el-col>
      <right-toolbar v-permission="['sys:course:query']" :show-search.sync="showSearch" @queryTable="getList"/>
    </el-row>

    <el-table v-loading="loading" :data="courseList">
      <el-table-column label="编号" prop="id" align="center" width="80" :show-overflow-tooltip="true" sortable/>
      <el-table-column label="标题" prop="title" align="center" width="300" :show-overflow-tooltip="true"/>
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
      <el-table-column label="学习人数" prop="learnPersons" align="center" :show-overflow-tooltip="true" width="90" v-if="checkPermission(['sys:course:student:query'])">
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="100">
        <template v-slot="scope">
          <el-button
            v-permission="['sys:course:detail:view']"
            size="mini"
            type="text"
            icon="el-icon-view"
            style="margin-left: 10px"
            @click.stop="handleView(scope.row)"
          >课程详情
          </el-button>
          <el-button
            v-permission="['sys:course:video:query']"
            size="mini"
            type="text"
            icon="el-icon-video-camera"
            style="margin-left: 10px"
            @click.stop="handleVideoView(scope.row)"
          >课程视频
          </el-button>
          <el-button
            v-permission="['sys:course:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
          >修改课程
          </el-button>
          <el-button
            v-if="scope.row.auditStatus ===0"
            v-permission="['sys:course:audit']"
            size="mini"
            type="text"
            icon="el-icon-document-checked"
            @click.stop="handleAudit(scope.row)"
          >审核课程
          </el-button>

          <el-button
            v-permission="['sys:course:delete']"
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

    <!-- 添加或修改课程配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :before-close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入课程名称"/>
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  listCourse,
  delCourse,
  addCourse,
  updateCourse
} from '@/api/course'

export default {
  name: 'Course',
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
        isDiscount:undefined
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
    this.getList()
  },
  methods: {
    handleVideoView(row){
      this.$router.push({path:'/course/video-list', query: {
          id: row.id},
        replace: true})
    },
    goToStudent(row){
      this.$router.push({path:'/course/student-list', query: {
          id: row.id},
        replace: true})
    },
    handleView(row){
      this.$router.push({path:'/course/detail', query: {
          id: row.id},
        replace: true})
    },
    handleAudit(row){
      this.$router.push({path:'/course/detail', query: {
          id: row.id,status:row.auditStatus},
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
    },
    handleAdd() {
      this.$router.push({path:'/course/detail/add'})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({path:'/course/detail/edit', query: {
          id: row.id,code:row.code}})
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCourse(this.form).then(res => {
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
            addCourse(this.form).then(res => {
              if (res.error === 0){
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
      this.$confirm('确认删除课程编号为"' + courseIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
          return delCourse(row.id)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
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
