<template>
  <div class="app-container">
    <el-form v-permission="['sys:user:query']" v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true"
             @submit.native.prevent
    >
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
          <el-button
            v-permission="['sys:user:update']"
            type="warning"
            icon="el-icon-switch-button"
            size="mini"
            :disabled="multiple"
            @click="handleResetPwd"
          >重置密码
          </el-button>
      </el-col>

      <right-toolbar v-permission="['sys:user:query']" :show-search.sync="showSearch" @queryTable="getList"/>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" :row-key="getRowKeys">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" prop="id" align="center" :show-overflow-tooltip="true" width="50"/>
      <el-table-column label="用户账号" prop="username" align="center" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="用户昵称" prop="nickname" align="center" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="性别" prop="sex" align="center" width="80">
        <template v-slot="scope">
          {{
            scope.row.sex === 'male' ? '男' : (scope.row.sex === 'female' ? '女' : '保密')
          }}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="100">
        <template v-slot="scope">

          <el-image style="width:40px;height:40px;border:none;" :src="scope.row.avatar"
                    :preview-src-list="[scope.row.avatar]"
          ></el-image>

        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center" :show-overflow-tooltip="true"
                       width="120"
      ></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" :show-overflow-tooltip="true" width="200"/>
      <el-table-column label="角色" prop="roleTitle" align="center" :show-overflow-tooltip="true" width="100"/>
      <el-table-column label="注册时间" align="center" prop="createdAt" width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            style="margin-left: 10px;"
            v-permission="['sys:user:view']"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >用户详情
          </el-button>
          <el-button
            style="margin-left: 10px;"
            v-permission="['sys:user:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改用户
          </el-button>
          <el-button
            v-if="scope.row.roleId === 2"
            style="margin-left: 10px;"
            v-permission="['sys:user:teacher-info']"
            size="mini"
            type="text"
            icon="el-icon-paperclip"
            @click="handleTeacherInfo(scope.row)"
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
               :close-on-click-modal="false"
    >
      <el-form ref="userForm" :model="userForm" :rules="ruleValidate" label-width="80px">
        <el-form-item label="用户头像" prop="avatar" style="display: flex;align-items: center">
          <avatar :avatar="userForm.avatar" @updateAvatar="updateAvatar"/>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户账号"/>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" placeholder="请输入用户昵称"/>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="userForm.roleId" placeholder="请选择角色" clearable style="width:100%;">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.title"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isUpdate">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="userForm.password"
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
        <el-form-item label="确认密码" prop="checkPassword" v-if="!isUpdate">
          <el-input :type="passwordType" v-model="userForm.checkPassword" placeholder="请确认密码"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio label="unknown">未知</el-radio>
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" v-if="!isUpdate">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="邮箱 "v-if="!isUpdate" >
          <el-input v-model="userForm.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" v-if="isUpdate">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" v-if="isUpdate">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="职位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入职位"/>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="userForm.city" placeholder="请输入城市"/>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="userForm.signature" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancelUser">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog :title="title" :visible.sync="openRole" width="350px" append-to-body :before-close="cancelRole">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="openLoading">
        <el-form-item label="角色名称" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.title"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRole">确 定</el-button>
        <el-button @click="cancelRole">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用户详情" :visible.sync="openDetail" width="500px" append-to-body @close="cancelDetail">
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            用户账号
          </template>
          {{ form.username }}
        </el-descriptions-item>
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            用户昵称
          </template>
          {{form.nickname}}
        </el-descriptions-item>
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            手机号
          </template>
          {{form.mobile || '未设置'}}
        </el-descriptions-item>
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            邮箱
          </template>
          {{form.email || '未设置'}}
        </el-descriptions-item>
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            性别
          </template>
          {{form.sex === 'male' ? '男':(form.sex === 'female' ? '女':'未知')}}
        </el-descriptions-item>
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            角色
          </template>
          {{form.roleTitle}}
        </el-descriptions-item >
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            城市
          </template>
          {{form.city || '未设置'}}
        </el-descriptions-item >
        <el-descriptions-item :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            职位
          </template>
          {{form.job || '未设置'}}
        </el-descriptions-item >
        <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            UID
          </template>
          {{ form.uid}}
        </el-descriptions-item>
        <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}" >
          <template slot="label">
            学习时长
          </template>
          {{ form.learnHourTitle || '0 小时' }}
        </el-descriptions-item>
        <el-descriptions-item :span="2" :contentStyle="{'text-align': 'center'}">
          <template slot="label">
            注册时间
          </template>
          {{ form.createdAt}}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            个性签名
          </template>
          {{ form.signature || '未设置' }}
        </el-descriptions-item>
      </el-descriptions>

    </el-dialog>
  </div>
</template>

<script>

import {
  listUser,
  delUser,
  assignRole,
  resetUserPassword,
  createUser,updateUser
} from '@/api/system/user'
import { mapGetters } from 'vuex'
import userAvatar from '@/views/profile/userAvatar'
import { getRoleOptions } from '@/api/system/role'
import avatar from '@/components/Avatar'
export default {
  name: 'User',
  components: { userAvatar ,avatar},
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.userForm.password !== value) {
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
        'info'
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
      isUpdate:false,
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '用户角色不能为空', trigger: 'blur' }
        ]
      },
      ruleValidate: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        checkPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          { type: 'email', message: '邮箱不正确', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '用户角色不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$',
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        signature: [
          { type: 'string', max: 250, message: '用户个性签名不能超过250个字', trigger: 'blur' }
        ]
      }
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
    updateAvatar(url){
      this.userForm.avatar=url
    },
    handleTeacherInfo(row) {
      this.$router.push({
        path: '/system/user/teacher',
        query: {
          id: row.id
        },
        replace: true
      })
    },
    getRoleSelect() {
      getRoleOptions().then(res => {
        if (res.error === 0) {
          const { data } = res
          this.roleOptions = data || []
        }
      }).catch(() => {
        this.roleOptions = []
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
    handleView(row) {
      this.reset()
      this.openDetail = true
      Object.assign(this.form, row)
    },
    cancelDetail() {
      this.openDetail = false
    },
    getRowKeys(row) {
      return row.id
    },
    submitRole() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          assignRole({
            userId: this.form.id,
            roleId: this.form.roleId
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
          if (res.error === 0) {
            const { data } = res || []
            const { items, totalCount } = data || []
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
      this.$refs['userForm'].resetFields()
      this.reset()
    },
    // 取消按钮
    cancel(name) {
      this.$refs[name].clearValidate()
      this.title = undefined
      this.reset()
    },
    // 表单重置
    reset() {
      this.userForm = {
        id: undefined,
        username: undefined,
        avatar: undefined,
        nickname: undefined,
        password: undefined,
        checkPassword: undefined,
        sex: 'unknown',
        signature: '',
        mobile: undefined,
        email: undefined
      }
      this.form = {
        roleId: 1,
        title: undefined
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
      this.$router.replace('/system/user-list')
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.isUpdate=false
      this.passwordType=''
      this.title = '添加用户'
      this.userForm.avatar='http://localhost/image/default.png'
    },
    handTopUpdate() {
      this.handleUpdate(this.role)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.isUpdate=true
      Object.assign(this.userForm, row)
      this.open = true
      this.title = '修改用户'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          if (this.userForm.id)
          {  updateUser(this.userForm).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.cancelUser()
              this.handleQuery()
            })
        }else {
            createUser(this.userForm).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.cancelUser()
              this.handleQuery()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm('确认删除用户编号为"' + userIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (row.id) {
          return delUser([row.id])
        }
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
      this.$confirm('确认重置编号为"' + userIds + '"的用户密码?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      type:'warning'}).then(({ value }) => {
        return resetUserPassword(userIds, value)
      }).then((res) => {
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }).catch(() => {
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
