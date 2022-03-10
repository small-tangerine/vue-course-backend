<template>
  <div class="dashboard-editor-container" v-loading="infoLoading">
    <el-tooltip className="item" effect="dark" content="刷新数据" placement="right">
      <el-button size="mini" circle icon="el-icon-refresh-right" @click="refresh()"/>
    </el-tooltip>

    <panel-group :index-data="indexData" style="display:flex;justify-content: center"
                 @handleSetLineChartData="handleSetLineChartData"
    />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from '.././components/PanelGroup'
import LineChart from '.././components/LineChart'
import RaddarChart from '.././components/RaddarChart'
import PieChart from '.././components/PieChart'
import BarChart from '.././components/BarChart'

import { getInfoIndex } from '@/api/home'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      infoLoading: false,
      lineChartData: {},
      indexData: {
        dayArticle: 0,
        dayOnline: 0,
        dayResource: 0,
        dayUser: 0,
        dayVisit: 0,
        nowOnline: 0,
        totalArticle: 0,
        totalResource: 0,
        totalUser: 0
      },
      timer: ''
    }
  },
  created() {
    this.timer = setInterval(this.refresh, 1000 * 60 * 32)
    this.getInfo()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    refresh() {
      this.getInfo()
    },
    handleSetLineChartData(type) {
      this.lineChartData = {
        dayData: [120, 82, 91, 154, 162, 140, 145],
        nowData: [100, 120, 161, 134, 105, 160, 165],addTitle:'新增课程',totalTitle:'课程总量'
      }
    },
    getInfo() {
      this.infoLoading = true
      getInfoIndex().then(res => {
        if (res.error === 0) {
          this.indexData = res.data || []
          const { dayData, nowData } = res.data || []
          this.infoLoading = false
          this.lineChartData = { dayData: dayData || [], nowData: nowData || [],addTitle:'新增用户',totalTitle:'总用户量' }
        } else {
          this.infoLoading = true
          this.lineChartData = {
            dayData: [],
            nowData: [],addTitle:'',totalTitle:''
          }
        }
      }).catch(() => {
        this.infoLoading = false
        this.lineChartData = {
          dayData: [100, 120, 161, 134, 105, 160, 165],
          nowData: [120, 82, 91, 154, 162, 140, 145],
          addTitle:'默认1',totalTitle:'默认2'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
