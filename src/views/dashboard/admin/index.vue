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
        dayUser: 0,
       totalUser: 0,
       dayCourse: 0,
       totalCourse: 0,
       dayCost: 0,
       totalCost: 0,
       dayOrder:0,
       totalOrder:0
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
      this.getInfo(type)
    },
    getInfo(type) {
      this.infoLoading = true
      getInfoIndex(type).then(res => {
        const {data} =res
        if (res.error === 0) {
          this.indexData = data || {}
          const { dayData, totalData,addTitle,totalTitle,dayCostData,totalCostData } = res.data || []
          this.infoLoading = false
          if (type ===2 ){
            this.lineChartData = {
              dayData: dayCostData || [],
              totalData: totalCostData || [],
              addTitle: addTitle,
              totalTitle: totalTitle
            }
          }else {
            this.lineChartData = {
              dayData: dayData || [],
              totalData: totalData || [],
              addTitle: addTitle,
              totalTitle: totalTitle
            }
          }
        } else {
          this.infoLoading = true
          this.lineChartData = {
            dayData: [],
            totalData: [],addTitle:'',totalTitle:''
          }
        }
      }).catch(() => {
        this.infoLoading = false
        this.lineChartData = {
          dayData: [100, 120, 161, 134, 105, 160, 165],
          totalData: [120, 82, 91, 154, 162, 140, 145],
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
    top: 0;
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
