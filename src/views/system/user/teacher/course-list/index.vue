<template>
    <!-- 分类列表 -->
    <el-row :gutter="10">

      <el-col :xs="30" :sm="30" :md="15" :lg="24" :xl="24" style="margin-top: 20px">
        <el-card class="box-card">
 <el-descriptions class="margin-top" title="讲师课程"/>
          <!--工具栏-->
          <el-form v-permission="['sys:category:query']" v-show="showSearch" ref="queryForm" :model="queryParams"
                   :inline="true" @submit.native.prevent style="    margin-top: -46px;
    margin-left: 80px;"
          >
            <el-form-item>
              <el-input
                v-model="queryParams.keyword"
                placeholder="请输入关键词"
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

          <!--表格渲染-->
          <el-table ref="table" v-loading="loading" :data="dictList" highlight-current-row style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" prop="id" label="分类编号" align="center"/>
            <el-table-column :show-overflow-tooltip="true" prop="title" label="分类名称" align="center"/>
            <el-table-column :show-overflow-tooltip="true" prop="displayOrder" label="排序" align="center"/>
            <el-table-column label="创建时间" align="center" prop="createdAt" width="180"/>

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
    </el-row>
</template>

<script>
import checkPermission from '@/utils/permission'
import { listSQLDict} from '@/api/course/category'

export default {
  name: 'Dict',
  data() {
    return {
      loading: false,
      openDict: false,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 是否导出所有数据
      checkAll: false,
      // 总条数
      total: 2,
      title: '',
      // 表单参数
      form: {
        id: undefined,
        title: undefined,
        displayOrder: undefined,
      },
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 5,
        keyword: undefined
      },
      dictList: []
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    checkPermission,
    // 置空参数
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.detailList = []
      }
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      Object.assign(this.$data.queryParams, this.$options.data().queryParams)
      this.handleQuery()
    },
    getList() {
      this.loading = true
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
