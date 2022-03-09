<template>
  <div>
    <div>
      <!--表单组件-->
      <el-dialog
        append-to-body
        :before-close="cancelDetail"
        :visible.sync="openDetail"
        :title="title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="二级分类名称" prop="title">
            <el-input v-model="form.title" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="二级分类排序" prop="displayOrder">
            <el-input type="number" v-model.number="form.displayOrder" style="width: 300px;" min="0" max="65535"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDetail">确认</el-button>
          <el-button @click="cancelDetail">取消</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="dictLoading" :data="detailList" highlight-current-row style="width: 100%;">
        <el-table-column prop="id" label="分类编号" align="center"  width="80"/>
        <el-table-column prop="title" label="分类名称" align="center"  width="120" show-overflow-tooltip/>
        <el-table-column prop="displayOrder" label="排序" align="center"  width="50" />
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
              style="color: #F56C6C"
              v-permission="['sys:category:delete']"
              size="mini"
              type="text"
              icon="el-icon-delete"
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
        @pagination="getDetailList(undefined)"
      />
    </div>
  </div>
</template>

<script>
import { updateDataDetail, addDataDetail, delData, changeSQLDictStatus, getData } from '@/api/course/category'

export default {
  data() {
    const validNum = (rule, value, callback) => {
      const pattern = /^(1?[0-9]|20)$/
      if (pattern.test((value + ''))) {
        callback()
      } else {
        callback(new Error('请输入数字0-20'))
      }
    }
    return {
      openDetail: false,
      title: '',
      query: { dictName: '' },
      dictId: undefined,
      dictLoading: false,
      detailList: [],
      total: 0,
      queryParams: {
        page: 1,
        pageSize: 10,
        keyword: undefined,
        parentId: 0
      },
      form: {},
      rules: {
        title: [
          { required: true, message: '请输入二级分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancelDetail() {
      this.reset()
      this.$refs['form'].clearValidate()
      this.openDetail = false
    },
    submitDetail() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id === undefined) {
            this.form.parentId = this.dictId
            addDataDetail(this.form).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.openDetail = false
              this.getDetailList()
            })
          } else {
            updateDataDetail(this.form).then(res => {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.openDetail = false
              this.getDetailList()
            })
          }
        }
      })
    },
    getList(keyword){
      this.queryParams.page=1
      this.queryParams.pageSize=10
      this.getDetailList(keyword)
    },
    getDetailList(keyword) {
      this.dictLoading = true
      this.queryParams.parentId =this.dictId
      this.queryParams.keyword =keyword
      getData(this.queryParams).then(res => {
       if (res.error ===0){
         const { data } = res || []
         const {items,totalCount} = data || []
         this.detailList = items || []
         this.total = totalCount || 0
         this.dictLoading = false
       }
      }).catch(()=>{
        this.detailList = []
        this.total = 0
        this.dictLoading = false
      })
    },
    reset() {
      this.form = {
        id: undefined,
        title: undefined,
        displayOrder: undefined
      }
    },
    openAdd() {
      this.reset()
      this.openDetail = true
      this.title = '添加二级分类'
    },
    handleStatusChange(row) {
      const text = row.isEnabled === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.displayOrder + '"二级分类吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeSQLDictStatus(row.id, row.isEnabled)
      }).then((res) => {
        this.getDetailList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }).catch(function() {
        row.isEnabled = row.isEnabled === 0 ? 1 : 0
      })
    },
    handleUpdate(row) {
      // console.log(row)
      this.reset()
      Object.assign(this.form, row)
      this.openDetail = true
      this.title = '修改二级分类'
    },
    handleDelete(row) {
      const dictIds = row.id || this.ids
      this.$confirm('确认删除二级分类编号为"' + dictIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (row.id){
          return delData([row.id])
        }
        return delData(dictIds)
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

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
