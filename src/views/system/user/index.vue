<template>
  <div class="app-container">
    <el-form v-permission="['sys:user:query']" v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键词"
          clearable
          size="small"
          style="width: 180px"
          @clear="clearParams('keyword')"
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
          v-permission="['sys:user:create']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['sys:user:update']"
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
          v-permission="['sys:user:delete']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-tooltip class="item" effect="dark" content="初始密码: orange_123456" placement="bottom">
          <el-button
            v-permission="['sys:user:reset']"
            type="danger"
            icon="el-icon-switch-button"
            size="mini"
            :disabled="multiple"
            @click="handleResetPwd"
          >重置密码
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col v-permission="['sys:user:export']" :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
        <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
      </el-col>
      <right-toolbar v-permission="['sys:user:query']" :show-search.sync="showSearch" @queryTable="getList"/>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" :row-key='getRowKeys'>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" prop="id" align="center" :show-overflow-tooltip="true" width="50"/>
      <el-table-column label="用户账号" prop="username" align="center" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="用户昵称" prop="nickname" align="center" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="性别" prop="sex" align="center" width="80">
        <template v-slot="scope">
          {{
             scope.row.sex ==='male' ? '男' :( scope.row.sex ==='female' ? '女':'保密')
          }}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="100">
        <template v-slot="scope">

          <el-image style="width:40px;height:40px;border:none;" :src="scope.row.avatar"
                    :preview-src-list="[scope.row.avatar]"></el-image>

        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center" :show-overflow-tooltip="true"
                       width="120"></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" :show-overflow-tooltip="true" width="200"/>
      <el-table-column label="角色" prop="roleTitle" align="center" :show-overflow-tooltip="true" width="100"/>
      <el-table-column label="注册时间" align="center" prop="createdAt" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            style="margin-left: 10px;"
            v-permission="['sys:user:view']"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
          >详情
          </el-button>
          <el-button
            style="margin-left: 10px;"
            v-permission="['sys:user:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="scope.row.roleId === 3"
            style="margin-left: 10px;"
            v-permission="['sys:user:teacher-info']"
            size="mini"
            type="text"
            icon="el-icon-paperclip"
            @click="handleUpdate(scope.row)"
          >讲师信息
          </el-button>
          <el-button
            v-permission="['sys:user:assign:role']"
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleRole(scope.row)"
          >分配角色
          </el-button>
          <el-button
            v-permission="['sys:user:delete']"
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

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @close="cancelUser"
               :close-on-click-modal="false">
      <el-form ref="userForm" :model="userForm" :rules="ruleValidate" label-width="80px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户账号"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入用户昵称"/>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">

          <el-input
            :key="passwordType"
            ref="password"
            v-model="userForm.userPassword"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>

        </el-form-item>
        <el-form-item label="确认密码" prop="conPassword">
          <el-input type="password" v-model="userForm.conPassword" placeholder="请确认密码"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="userForm.selfDesc" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancelUser">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="openRole" width="350px" append-to-body :before-close="cancelRole">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="openLoading">
        <el-form-item label="角色名称" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色"  clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.title"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRole">确 定</el-button>
        <el-button @click="cancelRole">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配用户菜单显示权限对话框 -->
    <el-dialog :title="title" :visible.sync="openMenuScope" width="400px" append-to-body
               @close=" handleCheckedTreeExpand(false,'menu')">
      <el-form :model="form">
        <el-form-item style="text-align: center!important;">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-tree
            :style="'margin-left:'+ marginLeft+'px!important;'"
            v-loading="openLoading"
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

    <!-- 分配用户数据访问权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body
               @close="handleCheckedTreeExpand(false,'resource')">
      <el-form :model="form">
        <el-form-item style="text-align: center!important;">
          <el-checkbox v-model="resourceExpand" @change="handleCheckedTreeExpand($event, 'resource')">展开/折叠
          </el-checkbox>
          <el-checkbox v-model="resourceNodeAll" @change="handleCheckedTreeNodeAll($event, 'resource')">全选/全不选
          </el-checkbox>
          <el-tree
            :style="'margin-left:'+ marginLeft+'px!important;'"
            v-loading="openLoading"
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
  listUser,
  delUser,
  exportUser,
  dataScope,
  menuScope,
  changeUserStatus,
  assignRole,
  UserResourceList,
  UserMenuList,
  getUserRoleInfo,
  resetUserPassword,
  registerUser
} from '@/api/system/user'
import {mapGetters} from "vuex";
import userAvatar from "@/views/profile/userAvatar";
import { getRoleOptions } from '@/api/system/role'
export default {
  name: 'User',
  components: {userAvatar},
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.userForm.userPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tags: [
        'danger',
        'success',
        'primary',
        'info',
      ],
      // 遮罩层
      loading: true,
      uploadImg: false,
      passwordType: 'password',
      // 选中数组
      ids: [],
      role: {},
      userForm: {},
      openDetail: false,
      expands: [],//只展开一行放入当前行id
      loadingExpand: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      userId: undefined,
      type: undefined,
      info: {},
      showSearch: true,
      roleOptions: [],
      // 是否导出所有数据
      checkAll: false,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: '',
      marginLeft: 0,
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      openMenuScope: false,
      menuExpand: false,
      menuNodeAll: false,
      resourceExpand: false,
      resourceNodeAll: false,
      sexOptions: [],
      lockedOptions: [],
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
        page: 1,
        pageSize: 10,
        keyword: undefined,
        roleId: undefined
      },
      openRole: false,
      openLoading: false,
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        username: [
          {required: true, message: '用户名称不能为空', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '权限标识不能为空', trigger: 'blur'}
        ],
        roleId: [
          {required: true, message: '用户角色不能为空', trigger: 'blur'}
        ]
      },
      ruleValidate: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {
            pattern: '^(?!_)\\w{4,20}$',
            message: '仅支持4-20位英文、数字、_,不能以下划线开头',
            trigger: 'blur'
          }

        ],
        userPassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            pattern: '^(?![A-Z]+$)(?![a-z]+$)(?!\\d+$)(?![\\W_]+$)\\S{6,15}$',
            message: '请输入包含数字、字母或特殊字符的6至15位密码',
            trigger: 'blur'
          }
        ],
        conPassword: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {required: true, validator: equalToPassword, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱号', trigger: 'blur'},
          {type: 'email', message: '邮箱不正确', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {
            pattern: '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$',
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        nickname: [
          {required: true, message: '请输入用户昵称', trigger: 'blur'},
          {type: 'string', max: 10, message: '昵称不能超过10个字', trigger: 'blur'},
          {
            pattern: '^(?!_)[\u4E00-\u9FA5A-Za-z0-9_]{2,20}$',
            message: '仅支持4-20位汉字、英文、数字、_,不能以下划线开头',
            trigger: 'blur'
          }
        ],
        selfDesc: [
          {type: 'string', max: 100, message: '用户简介不能超过100个字', trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.queryParams.id = id
      this.getList()
    } else {
      this.getList()
    }
    this.getRoleSelect()
  },
  computed: {
    ...mapGetters(['id']),
    ...mapGetters(['name'])
  },
  methods: {
    getRoleSelect(){
      getRoleOptions().then(res =>{
        if (res.error === 0){
          const { data} =res
          this.roleOptions = data || []
        }
      }).catch(()=>{
         this.roleOptions =[]
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleViewDetail(title, type, id) {
      this.title = title
      this.userId = id
      this.type = type
      this.openDetail = true
    },
    getTag(index) {
      if (index <= 5) {
        return this.tags[0]

      }
      if (index <= 10) {
        return this.tags[1]

      }
      if (index <= 15) {
        return this.tags[2]

      }
      if (index <= 20) {
        return this.tags[3]

      }

    },
    handleViewCard(id) {
      this.$router.push({
        path: "/system/user/authentication",
        query: {
          userId: id
        }
      })
    },
    handleViewArticle(id) {
      this.$router.push({
        path: "/platform/article",
        query: {
          userId: id
        }
      })
    },
    handleViewResource(id) {
      this.$router.push({
        path: "/platform/resource",
        query: {
          userId: id
        }
      })
    },
    getRowKeys(row) {
      return row.id
    },
    submitRole() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          assignRole({
            userId: this.form.id,
            roleId: this.form.roleId,
          }).then(res => {
            if (res.error === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.openRole = false
              this.handleQuery()
            }
          })
        }
      })
    },
    handleRole(row) {
      this.reset()
      Object.assign(this.form, row)
      this.openRole = true
      this.title = '分配用户角色'
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.queryParams).then(
        res => {
          if (res.error === 0){
            const {data} = res || []
            const {items, totalCount} = data || []
            this.userList = items
            this.total = totalCount || 0
          }
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
        this.userList = []
        this.total = 0
      })
    },
    // 置空参数
    clearParams(val) {
      this.queryParams[val] = undefined
      this.handleQuery()
    },
    /** 查询菜单树结构 */
    getMenuTree(roleId) {
      UserMenuList(roleId).then(res => {
        const {data} = res
        this.menuOptions = data || []
      })
    },
    /** 查询权限资源树结构 */
    getPermissionTree() {
      UserResourceList(roleId).then(res => {
        const {data} = res
        this.resourceOptions = data || []
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
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.isEnabled === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return changeUserStatus(row.id, row.isEnabled)
      }).then((res) => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.handleQuery()
      }).catch(function () {
        row.isEnabled = row.isEnabled === 0 ? 1 : 0
      })
    },
    cancelRole() {
      this.openRole = false
      this.cancel('form')
    },
    cancelUser() {
      this.open = false
      this.passwordType = 'password'
      this.cancel('userForm')
    },
    resetForm() {
      this.$refs['userForm'].resetFields();
      this.reset()
    },
    // 取消按钮
    cancel(name) {
      this.$refs[name].clearValidate()
      this.title = undefined
      this.reset()
    },
    // 取消按钮（数据权限）
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
      this.userForm = {
        id: undefined,
        username: undefined,
        avatar: undefined,
        nickname: undefined,
        userPassword: undefined,
        conPassword: undefined,
        sex: undefined,
        selfDesc: '',
        mobile: undefined,
        email: undefined
      }
      this.form = {
        id: undefined,
        roleEnabled: 1,
        username: undefined,
        mobile: undefined,
        isEnabled: 1,
        userRoleMenuCollect: [],
        userRoleResourceCollect: [],
        roleDesc: '',
        roleId: undefined,
        assignId: undefined
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.expands = []
      this.info = {}
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.$router.replace("/system/user-list")
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
      this.title = '添加用户'
    },
    handTopUpdate() {
      this.handleUpdate(this.role)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      Object.assign(this.form, row)
      this.open = true
      this.title = '修改用户'
    },
    /** 分配数据权限操作 */
    async handleDataScope(row) {
      await this.reset()
      this.form = row
      this.openDataScope = true
      this.title = '分配数据访问权限'
      this.openLoading = true
      getUserRoleInfo(row.id).then(async res => {
        if (res.code === 2000) {
          const {roleId, userRoleResourceCollect} = res.data || {}
          this.form.roleId = roleId
          if (!roleId) {
            this.$message.error("请先分配角色!")
            this.openDataScope = false
            return
          }
          await UserResourceList(roleId).then(res => {
            if (res.code === 2000) {
              this.marginLeft = 70
              this.resourceOptions = res.data || []
            }
          })
          this.$nextTick(() => {
            const checked = []
            const data = JSON.parse(userRoleResourceCollect) || []
            data.forEach((i) => {
              const node = this.$refs.resource.getNode(i)
              if (node && node.isLeaf) {
                checked.push(i)
              }
            })
            this.permissionCheckeds = checked
          })
          this.openLoading = false
        }
      }).catch(() => {
        this.openLoading = false
      })
    },
    async handleMenuScope(row) {
      await this.reset()
      this.form = row
      this.openMenuScope = true
      this.title = '分配显示菜单'
      this.openLoading = true
      getUserRoleInfo(row.id).then(async res => {
        if (res.code === 2000) {
          const {roleId, userRoleMenuCollect, isEnabled} = res.data || {}

          if (isEnabled === 0) {
            this.$message({
              message: "操作失败：角色被禁用!",
              type: 'error'
            })
            return
          }
          this.form.roleId = roleId
          if (!roleId) {
            this.$message.error("请先分配角色!")
            this.openMenuScope = false
            return
          }
          await UserMenuList(roleId).then(res => {
            if (res.code === 2000) {
              this.menuOptions = res.data || []
              this.marginLeft = 70
            }
          })
          this.$nextTick(() => {
            const checked = []
            const data = JSON.parse(userRoleMenuCollect) || []
            data.forEach((i) => {
              const node = this.$refs.menu.getNode(i)
              if (node && node.isLeaf) {
                checked.push(i)
              }
            })
            this.menuCheckeds = checked
          })
          this.openLoading = false
        }
      }).catch(() => {
        this.openLoading = false
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          registerUser(this.userForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.cancelUser()
            this.handleQuery()
          })
        }
      })
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function () {
      if (this.form.id !== undefined) {
        const strList = JSON.stringify(this.getPermissionAllCheckedKeys())
        dataScope(this.form.id, this.form.roleId, strList, this.form.username).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.openDataScope = false
          this.handleQuery()
        })
      }
    },
    /** 提交按钮（显示菜单） */
    submitMenuScope: function () {
      const strList = JSON.stringify(this.getMenuAllCheckedKeys())
      menuScope(this.form.id, this.form.roleId, strList, this.form.username).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.openMenuScope = false
        this.handleQuery()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm('确认删除用户编号为"' + userIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delUser(userIds)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    /** 删除按钮操作 */
    handleResetPwd(row) {
      const userIds = row.id || this.ids
      this.$prompt('请输入登录密码', '确认重置用户编号为"' + userIds + '"的密码?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,15}$/,
        inputErrorMessage: '请输入包含数字、字母或特殊字符的6至15位以上密码'
      }).then(({value}) => {
        return resetUserPassword(userIds, value)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      if (this.checkAll) {
        queryParams.page = undefined
        queryParams.pageSize = undefined
        queryParams.export = 'all'
      }
      const str = queryParams.export ? '所有' : '当前'
      this.$confirm('是否确认导出' + str + '用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return exportUser(queryParams)
      }).then(response => {
        this.download(response.data || '用户数据.xlsx')
        this.checkAll = false
      })
    },
    renderContent(h, { node, data }) {
      return data.path ? (
        <span><span>{node.label}</span><span style='margin-left: 10px;'><el-tag size='mini'>{data.path}</el-tag></span></span>) : (
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

.el-table__expanded-cell {
  padding: 0 !important;
}

.demo-table-expand {
  padding: 0 !important;
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf !important;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  padding-left: 20px;
  padding-right: 20px;
}

.el-form-item__error {
  position: relative !important;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>
