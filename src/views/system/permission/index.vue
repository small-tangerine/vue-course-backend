<template>
  <div class="app-container">
    <el-form v-permission="['sys:role:query']" v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="菜单名称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('keyword')"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="状态"
          clearable
          size="small"
          style="width: 80px"
          @change="handleQuery"
          @clear="clearParams('type')"
        >
          <el-option
            v-for="dict in permissionTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permission="['sys:role:create']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['sys:role:update']"
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
          v-permission="['sys:role:delete']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <right-toolbar v-permission="['sys:role:query']" :show-search.sync="showSearch" @queryTable="handleQuery" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="permissionList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="id" label="菜单编号" width="120" align="center" />
      <el-table-column prop="title" label="菜单名称" :show-overflow-tooltip="true" width="160" align="center" />
      <el-table-column prop="enTitle" label="菜单标签" :show-overflow-tooltip="true" width="160" align="center" />
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.typeId !==3 && scope.row.icon" :icon-class="scope.row.icon" />
          <span v-else>未设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="displayOrder" label="排序" width="60" align="center" />
      <el-table-column prop="path" label="访问路径" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="是否隐藏" align="center" width="100" v-if="checkPermission(['sys:role:update'])">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.typeId !== 3 "
            v-model="scope.row.isHidden"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="handleHiddenStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['sys:role:create']"
            style="margin-left: 10px;"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-permission="['sys:role:update']"
            v-if="scope.row.typeId !== 3"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <tree-select
                v-model="form.parentId"
                :options="permissionOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="菜单类型" prop="typeId">
              <el-radio-group v-model="form.typeId" @change="changeType($event, form)">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="标签" prop="enTitle">
              <el-input v-model="form.enTitle" placeholder="请输入菜单标签" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="!(form.typeId === 3)" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="displayOrder">
              <el-input-number v-model="form.displayOrder" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="!form.id && !(form.typeId === 3)" label="是否隐藏">
              <el-radio-group v-model="form.isHidden">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!(form.typeId === 3)" label="路由地址">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!(form.typeId === 3)" label="组件路径">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.typeId === 1" label="重定向">
              <el-input v-model="form.redirect" placeholder="请输入重定向地址" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.typeId === 3" label="访问路径" prop="path">
              <el-input v-model="form.path" placeholder="请输入访问路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.typeId === 3" label="权限标识" prop="permissionTag">
              <el-input v-model="form.permissionTag" placeholder="请输入权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.note"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  listMenu,
  delMenu,
  addMenu,
  updateMenu,
  changeMenuHiddenStatus
} from '@/api/system/menu'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'Menu',
  components: { TreeSelect, IconSelect },
  data() {
    return {
      // 总数
      // total: 0,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 菜单表格树数据
      permissionList: [],
      // 菜单编号数组
      ids: [],
      // 菜单数据
      permission: undefined,
      // 菜单树选项
      permissionOptions: [],
      // 菜单类型
      permissionTypeOptions: [{value:1,label:'目录'},{value: 2,label: '菜单'},{value: 3,label: '按钮'}],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 请求方式
      methodOptions: [],
      total: 0,
      // 查询参数
      queryParams: {
        pageSize: 10,
        keyword:undefined,
        type:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        displayOrder: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '访问路径不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择父级', trigger: 'change' }
        ],
        component: [
          { required: true, message: '组件路径不能为空', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '菜单类型不能为空', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          {
            pattern: '^[a-z]{4,15}:[a-z]{4,15}:[a-z]{4,15}$',
            message: '请输入正确的权限标识：*:*:*',
            trigger: 'blur'
          }
        ],
        enTitle: [
          { required: true, message: '菜单标签不能为空', trigger: 'blur' },
          {
            pattern: '^[a-zA-Z]{4,20}$',
            message: '请输入4-20位英文小写菜单标签',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
  },
  methods: {
    // 菜单类型
    changeType(event, form) {
      event === 1 ? form.component = 'Layout' : form.component = ''
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    // 置空参数
    clearParams(val) {
      this.queryParams[val] = undefined
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      selection.length !== 1 ? this.single = true : (this.single = false, this.permission = selection[0])
      this.multiple = !selection.length
    },
    // 菜单隐藏状态修改
    handleHiddenStatusChange(row) {
      const text = row.isHidden === 1 ? '隐藏' : '显示'
      this.$confirm('确认要"' + text + '""' + row.title + '"菜单吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeMenuHiddenStatus(row.id, row.isHidden,row.typeId)
      }).then((res) => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.handleQuery()
      }).catch(function() {
        row.isHidden = row.isHidden === 0 ? 1 : 0
      })
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      listMenu(this.queryParams).then(res => {
        if(res.error===0){
          const { data } = res
          const rowsOptions = data || []
          this.permissionList = this.handleTree(rowsOptions || [], 'id')
          this.loading = false
        }else {
          this.permissionList=[]
          this.loading=false
        }
      }).catch(()=>{
        this.permissionList=[]
        this.loading=false
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children,
        isDisabled: node.typeId === 3
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        const { data } = response || []
        this.permissionOptions = []
        const permission = { id: 0, title: '主类目', children: [] }
        permission.children = this.handleTree(data || [], 'id')
        this.permissionOptions.push(permission)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        icon: '',
        enTitle: '',
        component: '',
        id: undefined,
        isHidden: 0,
        title: '',
        displayOrder: 999,
        typeId: undefined,
        permissionTag: '',
        parentId: 0,
        path: '',
        redirect: '',
        note: ''
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row && row.id) {
        this.form.parentId = row.id
        this.form.typeId = 2
        this.form.component = ''
      } else {
        this.form.parentId = 0
        this.form.typeId = 1
        this.form.component = 'Layout'
      }
      this.open = true
      this.title = '添加菜单'
    },
    handTopUpdate() {
      this.handleUpdate(this.permission)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      Object.assign(this.form, row)
      this.open = true
      this.title = '修改菜单'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.children = undefined
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateMenu(this.form).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          } else {
            addMenu(this.form).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const permissionIds = row.id || this.ids
      this.$confirm('确认删除菜单编号为"' + permissionIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (row.id){
          return delMenu([row.id])
        }
        return delMenu(permissionIds)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
  }
}
</script>

<style>

#table2 .el-table__expanded-cell{
  padding:0 !important;
  border-bottom: none;
}
.hiderow .el-table__expand-column .el-icon {
  visibility: hidden;
}

</style>
