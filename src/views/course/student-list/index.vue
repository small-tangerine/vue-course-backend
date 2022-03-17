<template>
  <div class="app-container">
  <!-- 分类列表 -->

        <el-form v-permission="['sys:course:student:query']"  ref="queryForm" :model="queryParams" :inline="true"
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
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
          <el-form-item  style="margin-left:50px;width: 200px"><span style="color: #ff4949; font-weight: bold;line-height: 36px">课程总收入： ￥{{cost}}</span></el-form-item>
          <el-form-item style="float: right">
          <el-button type="primary" size="mini" @click="returnGo" style="margin-right: -1px">返回</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="studentList">
          <el-table-column label="编号" prop="id" align="center" width="80" :show-overflow-tooltip="true" sortable/>
          <el-table-column label="学生名称" prop="userTitle" align="center" width="150" :show-overflow-tooltip="true"/>
          <el-table-column label="课程购买价格" prop="cost" align="center" width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="课程名称" align="center" prop="courseTitle" width="350" :show-overflow-tooltip="true"/>
          <el-table-column label="累计学习时长(分钟)" prop="note" align="center" :show-overflow-tooltip="true" >
            <template v-slot="scope">
               {{ (scope.row.learnLength || 0) | filterSecond}}
            </template>
          </el-table-column>
          <el-table-column label="最近一次学习时间" align="center" prop="recentAt"  >
            <template v-slot="scope">
              <span>{{ scope.row.recentAt }}</span>
            </template>
          </el-table-column>
          <el-table-column label="首次学习时间" align="center" prop="createdAt"  >
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
  </div>
</template>

<script>
import {
  listStudentList
} from '@/api/course'
import {normalSeconds} from "@/utils/utils";
export default {
  name: 'StudentList',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      student: {},
      // 总条数
      total: 0,
      // 课程表格数据
      studentList: [],
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        keyword: undefined,
        courseId:undefined
      },
      courseId:undefined,
      // 表单参数
      form: {},
      cost:0
    }
  },
  created() {
    const  id=this.$route.query && this.$route.query.id
    if (id)
    {
      this.courseId=id
      this.queryParams.courseId=id
    }
    this.getList()
  },
  methods: {
    returnGo(){
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.go(-1)
    },
    /** 查询课程列表 */
    getList() {
      this.loading = true
      listStudentList(this.queryParams).then(
        res => {
          if (res.error === 0) {
            const { data } = res || []
            const { items, totalCount ,extra} = data || []
            this.studentList = items || []
            this.total = totalCount || 0
            const {cost} = extra || []
            this.cost=cost || 0
            this.loading = false
          }
        }
      ).catch(() => {
        this.loading = false
        this.total = 0
        this.studentList = []
      })
    },
    // 置空参数
    clearParams(val) {
      this.queryParams[val] = undefined
      this.handleQuery()
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
      this.queryParams.courseId=this.courseId
      this.handleQuery()
    },
  },
  filters: {
    filterSecond (val) {
      return normalSeconds(val)
    }
  }
}
</script>
