<template>
  <div class="app-container">
    <el-form v-permission="['sys:role:query']" v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
      <el-form-item label="关键词" prop="title">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键词"
          clearable
          size="small"
          style="width: 240px"
          @clear="clearParams('title')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
      <el-col v-permission="['sys:role:export']" :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
        <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
      </el-col>
      <right-toolbar v-permission="['sys:role:query']" :show-search.sync="showSearch" @queryTable="getList"/>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="角色编号" prop="id" align="center" width="120" sortable/>
      <el-table-column label="角色名称" prop="title" align="center" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="角色描述" prop="note" align="center" :show-overflow-tooltip="true" width="250"/>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180" sortable>
        <template v-slot="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template v-slot="scope">
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            style="margin-left: 10px;"
            v-permission="['sys:role:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-permission="['sys:role:menu']"
            size="mini"
            type="text"
            icon="el-icon-menu"
            @click="handleMenuScope(scope.row)"
          >显示菜单
          </el-button>
          <el-button
            v-permission="['sys:role:permission']"
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDataScope(scope.row)"
          >分配权限
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
      :page.sync="queryParams.pageNum"
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

    <!-- 分配角色菜单显示权限对话框 -->
    <el-dialog :title="title" :visible.sync="openMenuScope" width="400px" append-to-body
               @close=" handleCheckedTreeExpand(false,'menu')"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item>
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-tree
            ref="menu"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            :default-checked-keys="menuCheckeds"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMenuScope">确 定</el-button>
        <el-button @click="cancelDataScope('menu')">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色角色访问权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body
               @close="handleCheckedTreeExpand(false,'resource')"
    >
      <el-form :model="form">
        <el-form-item>
          <el-checkbox v-model="resourceExpand" @change="handleCheckedTreeExpand($event, 'resource')">展开/折叠
          </el-checkbox>
          <el-checkbox v-model="resourceNodeAll" @change="handleCheckedTreeNodeAll($event, 'resource')">全选/全不选
          </el-checkbox>
          <el-tree
            ref="resource"
            class="tree-border"
            :data="resourceOptions"
            show-checkbox
            :default-checked-keys="permissionCheckeds"
            :render-content="renderContent"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope('resource')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  menuScope,
  changeRoleStatus
} from '@/api/system/role'
import { treeselect as menuTree } from '@/api/system/menu'
import { treeselect as permissionTree } from '@/api/system/permission'

export default {
  name: 'Role',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      role: {},
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
      roleList: [],
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
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 菜单列表
      menuOptions: [],
      // 选中菜单
      menuCheckeds: [],
      // 选中权限资源
      permissionCheckeds: [],
      // 权限资源列表
      resourceOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined
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
    // this.getMenuTree()
    this.getPermissionTree()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.queryParams).then(
        res => {
          if (res.error === 0) {
            const { data } = res || []
            const { items, totalCount } = data || []
            this.roleList = items || []
            this.total = totalCount || 0
            this.loading = false
          }
        }
      ).catch(() => {
        this.loading = false
        this.total = 0
        this.roleList = []
      })
    },
    // 置空参数
    clearParams(val) {
      this.queryParams[val] = undefined
      this.handleQuery()
    },
    /** 查询菜单树结构 */
    getMenuTree() {
      menuTree().then(res => {
        const { data } = res
        this.menuOptions = data || []
      }).catch(() => {
        this.menuOptions = []
      })
    },
    /** 查询权限资源树结构 */
    getPermissionTree() {
      permissionTree().then(res => {
        if (res.error === 0) {
          const { data } = res
          this.resourceOptions = data || []
        }
      }).catch(() => {
        this.resourceOptions = []
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 所有权限资源节点数据
    getPermissionAllCheckedKeys() {
      // 目前被选中的权限资源节点
      const checkedKeys = this.$refs.resource.getCheckedKeys()
      // 半选中的权限资源节点
      const halfCheckedKeys = this.$refs.resource.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
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
      this.queryParams.pageNum = 1
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
      selection.length !== 1 ? this.single = true : (this.single = false, this.role = selection[0])
      this.multiple = !selection.length
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type === 'resource') {
        const treeList = this.resourceOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.resource.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'resource') {
        this.$refs.resource.setCheckedNodes(value ? this.resourceOptions : [])
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加角色'
    },
    handTopUpdate() {
      this.handleUpdate(this.role)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      Object.assign(this.form, row)
      this.open = true
      this.title = '修改角色'
      // })
    },
    /** 分配数据权限操作 */
    async handleDataScope(row) {
      await this.reset()
      this.form = row
      this.openDataScope = true
      this.$nextTick(() => {
        const checked = []
        const data = row.resourceCollect || []
        data.forEach((i) => {
          const node = this.$refs.resource.getNode(i)
          if (node && node.isLeaf) {
            checked.push(i)
          }
        })
        this.permissionCheckeds = checked
      })

      this.title = '分配角色访问权限'
    },
    async handleMenuScope(row) {
      await this.reset()
      this.form = row
      this.openMenuScope = true
      this.$nextTick(() => {
        const checked = []
        const data = JSON.parse(row.menuCollect) || []
        data.forEach((i) => {
          const node = this.$refs.menu.getNode(i)
          if (node && node.isLeaf) {
            checked.push(i)
          }
        })
        this.menuCheckeds = checked
      })
      this.title = '分配显示菜单'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateRole(this.form).then(res => {
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
            addRole(this.form).then(res => {
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
    /** 提交按钮（分配权限） */
    submitDataScope: function() {
      if (this.form.id !== undefined) {
        const strList = this.getPermissionAllCheckedKeys()
        dataScope(this.form.id, strList).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.openDataScope = false
          this.getList()
        })
      }
    },
    /** 提交按钮（显示菜单） */
    submitMenuScope: function() {
      const strList = JSON.stringify(this.getMenuAllCheckedKeys())
      menuScope(this.form.id, strList).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.openMenuScope = false
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id || this.ids
      this.$confirm('确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (row.id){
          return delRole([row.id])
        }
        return delRole(roleIds)
      }).then((res) => {
        this.getList()
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
        queryParams.pageNum = undefined
        queryParams.pageSize = undefined
        queryParams.export = 'all'
      }
      const str = queryParams.export ? '所有' : '当前'
      this.$confirm('是否确认导出' + str + '角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportRole(queryParams)
      }).then(response => {
        this.download(response.data || '角色数据.xlsx')
        this.checkAll = false
      })
    },
    renderContent(h, { node, data }) {
      return data.path ? (
        <span><span>{node.label}</span><span style="margin-left: 10px;"><el-tag size="mini">{data.path}</el-tag></span></span>) : (
        <span><span>{node.label}</span></span>)
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
