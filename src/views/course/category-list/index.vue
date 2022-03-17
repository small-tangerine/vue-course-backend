<template>
  <div class="app-container">
    <!--表单组件-->
    <el-dialog append-to-body :before-close="cancelDict" :visible.sync="openDict" :title="title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="form.title" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="分类排序" prop="displayOrder">
          <el-input type="number" v-model="form.displayOrder" style="width: 370px;" min="0" max="65535"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDict">确 定</el-button>
        <el-button @click="cancelDict">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分类列表 -->
    <el-row :gutter="10">
      <el-col :xs="30" :sm="30" :md="15" :lg="13" :xl="13" style="margin-bottom: 10px">
        <el-card class="box-card">

          <!--工具栏-->
          <el-form v-permission="['sys:category:query']" v-show="showSearch" ref="queryForm" :model="queryParams"
                   :inline="true" @submit.native.prevent
          >
            <el-form-item label="分类名称">
              <el-input
                v-model="queryParams.keyword"
                placeholder="请输入分类名称"
                clearable
                size="small"
                style="width: 200px"
                @clear="clearParams('keyword')"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button v-permission="['sys:category:query']" type="cyan" icon="el-icon-search" size="mini"
                         @click="handleQuery"
              >搜索
              </el-button>
              <el-button v-permission="['sys:category:query']" icon="el-icon-refresh" size="mini" @click="resetQuery">
                重置
              </el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                v-permission="['sys:category:create']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permission="['sys:category:update']"
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handTopUpdate"
              >修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permission="['sys:category:delete']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除
              </el-button>
            </el-col>
            <el-col v-permission="['sys:category:export']" :span="1.5">
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
              >导出
              </el-button>
              <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
            </el-col>
            <right-toolbar v-permission="['sys:category:query']" :show-search.sync="showSearch"
                           @queryTable="handleQuery"
            />
          </el-row>

          <!--表格渲染-->
          <el-table ref="table" v-loading="loading" :data="dictList" highlight-current-row style="width: 100%;"
                    @selection-change="handleSelectionChange" @current-change="handleCurrentChange"
          >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column :show-overflow-tooltip="true" prop="id" label="分类编号" align="center"/>
            <el-table-column :show-overflow-tooltip="true" prop="title" label="分类名称" align="center"/>
            <el-table-column :show-overflow-tooltip="true" prop="displayOrder" label="排序" align="center"/>
            <el-table-column label="创建时间" align="center" prop="createdAt" width="180"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template v-slot="scope">
                <el-button
                  style="margin-left: 10px;"
                  v-permission="['sys:category:update']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permission="['sys:category:delete']"
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

          <!--分页组件-->
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
      <!-- 分类详情列表 -->
      <el-col :xs="25" :sm="25" :md="9" :lg="11" :xl="11">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>二级分类</span>
            <div style="margin-top: 5px">
              <el-form v-if="checkPermission(['sys:category:level:query']) && showDetailAdd" ref="queryForm"
                       :model="detailParams" :inline="true" @submit.native.prevent
              >
                <el-form-item>
                  <el-input
                    v-model="detailParams.keyword"
                    placeholder="请输入分类名称"
                    clearable
                    size="small"
                    style="width: 200px"
                    @clear="detail('keyword')"
                    @keyup.enter.native="handleDetailQuery"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button v-permission="['sys:category:level:query']" type="cyan" icon="el-icon-search" size="mini"
                             @click="handleDetailQuery"
                  >搜索
                  </el-button>
                  <el-button v-permission="['sys:category:level:query']" icon="el-icon-refresh" size="mini"
                             @click="resetDetailQuery"
                  >重置
                  </el-button>
                </el-form-item>
              </el-form>
              <el-button
                v-if="checkPermission(['sys:category:update']) && showDetailAdd"
                class="filter-item"
                size="mini"
                style="float: right;padding: 4px 10px;margin-top: -52px"
                type="primary"
                icon="el-icon-plus"
                @click="$refs.dictDetail && $refs.dictDetail.openAdd()"
              >新增
              </el-button>
            </div>
          </div>
          <div v-if="!showDetailAdd">
            <div class="my-code">点击分类查看详情</div>
          </div>
          <dictDetail v-if="showDetailAdd" ref="dictDetail"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import dictDetail from './dictDetail'
import { listSQLDict, changeSQLDictStatus, updateData, delData, addData, exportData } from '@/api/course/category'

export default {
  name: 'Dict',
  components: { dictDetail },
  data() {
    return {
      loading: false,

      openDict: false,
      // 选中数组
      ids: [],
      // 是否显示详情添加
      showDetailAdd: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 是否导出所有数据
      checkAll: false,
      // 总条数
      total: 2,
      title: '',
      dict: [],
      // 表单参数
      form: {
        id: undefined,
        title: undefined,
        displayOrder: undefined,
        isEnabled: 1,
        dictDesc: ''
      },
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 5,
        keyword: undefined
      },
      detailParams: {
        page: 1,
        pageSize: 10,
        keyword: undefined
      },
      rules: {
        title: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      dictList: []
    }
  },
  created() {
    this.handleQuery()
    this.showDetailAdd = false
  },
  methods: {
    checkPermission,
    // 获取数据前设置好接口地址
    beforeCrudRefresh() {
      this.$nextTick(() => {
        this.$refs.dictDetail.dictId = undefined
        this.$refs.dictDetail.detailList = []
      })
      return true
    },
    // 置空参数
    clearParams(val) {
      this.queryParams[val] = undefined
      this.handleQuery()
    },
    detail(val) {
      this.detailParams[val] = undefined
      this.handleDetailQuery()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.detailList = []
      }
      this.queryParams.page = 1
      this.queryParams.parentId = 0
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.handleQuery()
    },
    /** 搜索按钮操作 */
    handleDetailQuery() {
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.getList(this.detailParams.keyword)
      }
    },
    /** 重置按钮操作 */
    resetDetailQuery() {
      Object.assign(this.$data.detailParams, this.$options.data().detailParams)
      this.handleDetailQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // console.log(selection)
      this.ids = selection.map(item => item.id)
      selection.length !== 1 ? this.single = true : (this.single = false, this.dict = selection[0])
      this.multiple = !selection.length
    },
    // 角色状态修改
    handleStatusChange(row) {
      const text = row.isEnabled === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.fieldName + '"分类吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeSQLDictStatus(row.id, row.isEnabled)
      }).then((res) => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.handleQuery()
      }).catch(function() {
        row.isEnabled = row.isEnabled === 0 ? 1 : 0
      })
    },
    // 选中分类后，设置分类详情数据
    handleCurrentChange(val) {
      if (val) {
        this.showDetailAdd = true
        this.$nextTick(() => {
          this.$refs.dictDetail.dictId = val.id
          this.detailParams.keyword =undefined
          this.$refs.dictDetail.getList()
        })
      }
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        title: undefined,
        fieldName: undefined,
        isEnabled: 1,
        dictDesc: ''
      }
    },
    cancelDict() {
      this.reset()
      this.$refs['form'].clearValidate()
      this.openDict = false
    },
    submitDict() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateData(this.form).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.openDict = false
              this.handleQuery()
            })
          } else {
            addData(this.form).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.openDict = false
              this.handleQuery()
            })
          }
        }
      })
    },
    getList() {
      this.loading = true
      this.showDetailAdd = false
      listSQLDict(this.queryParams).then(
        res => {
          if (res.error === 0) {
            const { data } = res || []
            const { items, totalCount } = data || []
            this.dictList = items || []
            this.total = totalCount || 0
            this.loading = false
          }
        }
      ).catch(() => {
        this.dictList = []
        this.total = 0
        this.loading = false
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.openDict = true
      this.title = '添加分类'
    },
    handTopUpdate() {
      this.handleUpdate(this.dict)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.openDict = true
      Object.assign(this.form, row)
      this.title = '修改分类'
      // })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.id || this.ids
      this.$confirm('确认删除分类编号为"' + dictIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (row.id){
          return delData([row.id])
        }
        return delData(dictIds)
      }).then((res) => {
        this.handleQuery()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      if (this.checkAll) {
        queryParams.page = undefined
        queryParams.pageSize = undefined
        queryParams.data.parentId = undefined
        queryParams.export = 'all'
      }
      const str = queryParams.export ? '当前' : '所有'
      this.$confirm('确认导出' + str + '分类数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportData(queryParams)
      }).then(response => {
        this.download(response.data || '分类数据')
        this.checkAll = false
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
