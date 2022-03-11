<template>
  <div class="app-container">
    <el-form v-permission="['sys:role:query']" v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
      <el-form-item label="订单号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入订单号"
          clearable
          size="small"
          style="width: 240px"
          @clear="clearParams('code')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="payStatus">
        <el-select
          v-model="queryParams.payStatus"
          placeholder="状态"
          clearable
          size="small"
          style="width: 100px"
          @change="getList"
          @clear="clearParams('payStatus')"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.payStatus"
            :label="dict.payStatusTitle"
            :value="dict.payStatus"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="payType">
        <el-select
          v-model="queryParams.payType"
          placeholder="状态"
          clearable
          size="small"
          style="width: 100px"
          @change="getList"
          @clear="clearParams('payType')"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.payType"
            :label="dict.payTypeTitle"
            :value="dict.payType"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col v-if="totalCost > 0" style="margin-top: 5px;width: 200px"><span style="font-weight: bold">订单总额： ￥{{totalCost}}</span></el-col>
      <el-col  v-if="payCost > 0"  style="margin-top: 5px;width: 200px"><span style="color: #ff4949; font-weight: bold">交易总额： ￥{{payCost}}</span></el-col>
      <right-toolbar v-permission="['sys:role:query']" :show-search.sync="showSearch" @queryTable="getList"/>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column label="订单编号" prop="id" align="center" width="100" :show-overflow-tooltip="true" sortable/>
      <el-table-column label="订单号" prop="code" align="center" width="200"/>
      <el-table-column label="订单用户" prop="userTitle" align="center" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="订单金额(元)" prop="cost" align="center" :show-overflow-tooltip="true" width="100"/>
      <el-table-column label="订单状态" prop="note" align="center" :show-overflow-tooltip="true" width="90">
        <template v-slot="scope">
          <el-tag :type="scope.row.payStatus === 1 ? 'success':(scope.row.payStatus === 0 ? 'info' :'danger')" >{{ scope.row.payStatusTitle }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" prop="payTypeTitle" align="center" :show-overflow-tooltip="true" width="90"/>
      <el-table-column label="支付时间" align="center" prop="createdAt" width="150">
        <template v-slot="scope">
          <span>{{ scope.row.payAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" align="center" prop="createdAt" width="150" >
        <template v-slot="scope">
          <span>{{ scope.row.expiredAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="150" >
        <template v-slot="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="scope">
          <el-button
            v-permission="['sys:user:view']"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >订单详情
          </el-button>
          <el-button
            v-permission="['sys:role:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-permission="['sys:role:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            style="color: #F56C6C"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :before-close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="角色描述">
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
  listOrder,
  delOrder,
  addOrder,
  updateOrder
} from '@/api/order'

export default {
  name: 'Order',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      order: {},
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
      // 角色表格数据
      orderList: [],
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
      statusOptions:[{
        payStatus: 1,
        payStatusTitle: '已完成'
      },
        {
          payStatus: 0,
          payStatusTitle: '未支付'
        },
        {
          payStatus: 2,
          payStatusTitle: '已取消'
        }],
      typeOptions:[{
        payType: 1,
        payTypeTitle: '余额'
      },
        {
          payType: 3,
          payTypeTitle: '微信'
        }, {
          payType: 2,
          payTypeTitle: '支付宝'
        },],
      // 日期范围
      dateRange: [],
      payCost:0,
      totalCost:0,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        code: undefined,
        payStatus:undefined,
        payType:undefined
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
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleView(row){

    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listOrder(this.queryParams).then(
        res => {
          if (res.error === 0) {
            const { data } = res || []
            const { items, totalCount ,extra} = data || []
            this.orderList = items || []
            this.total = totalCount || 0
            const {totalCost,payCost} = extra || []
            this.payCost=payCost || 0
            this.totalCost = totalCost || 0
            this.loading = false
          }
        }
      ).catch(() => {
        this.loading = false
        this.total = 0
        this.orderList = []
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      // console.log(selection)
      this.ids = selection.map(item => item.id)
      selection.length !== 1 ? this.single = true : (this.single = false, this.order = selection[0])
      this.multiple = !selection.length
    },
    handTopUpdate() {
      this.handleUpdate(this.order)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      Object.assign(this.form, row)
      this.open = true
      this.title = '修改角色'
      // })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateOrder(this.form).then(res => {
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
            addOrder(this.form).then(res => {
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
      const orderIds = row.id || this.ids
      this.$confirm('确认删除角色编号为"' + orderIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (row.id){
          return delOrder([row.id])
        }
        return delOrder(orderIds)
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
