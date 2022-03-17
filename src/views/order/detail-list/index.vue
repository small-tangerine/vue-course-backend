<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-button
        type="primary"
        size="mini"
        @click="handleReturn"
      >返回
      </el-button>
    </el-row>
    <el-table v-loading="loading" :data="detailList">
      <el-table-column label="详情编号" prop="id" align="center"  />
      <el-table-column label="订单号" prop="code" align="center" width="200">{{code}}</el-table-column>
      <el-table-column label="课程名称" prop="title" align="center" width="500" />
      <el-table-column label="封面图片" align="center" >
        <template slot-scope="scope">
          <el-image style="width:90px;height:50px;border:none;" :src="scope.row.img"
                    :preview-src-list="[scope.row.img]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="课程原价" prop="price" align="center"
                       ></el-table-column>
      <el-table-column label="是否有折扣" prop="email" align="center" >
        <template v-slot="scope">
          <el-tag :type="scope.row.isDiscount === 1 ? 'success':'danger'" >{{scope.row.isDiscount === 1?'是':'否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="折扣价格" align="center" prop="discountPrice" />
      <el-table-column label="创建时间" align="center" prop="createdAt"/>
    </el-table>
  </div>
</template>

<script>
import {
  listDetail
} from '@/api/order'
export default {
  name: 'Detail',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      detailList: [],
      // 弹出层标题
      code:undefined
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    this.code = this.$route.query && this.$route.query.code
    if (id) {
      this.getList(id)
    }
  },
  methods: {
    handleReturn(){
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.replace({ path: '/order/order-list' })
    },
    /** 查询用户列表 */
    getList(id) {
      this.loading = true
      listDetail({id:id}).then(
        res => {
          const {data} = res || []
          this.detailList = data || []
          this.loading = false
        }
      ).catch(() => {
        this.detailList = data || []
        this.loading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
