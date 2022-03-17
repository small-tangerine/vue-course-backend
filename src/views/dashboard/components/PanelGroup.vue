<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-if="roleId === 1" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(0)">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户总量
          </div>
          <count-to :start-val="0" :end-val="indexData.totalUser" :duration="3000" class="card-panel-num"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            新用户
          </div>
          <count-to :start-val="0" :end-val="indexData.dayUser" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(1)">
        <div class="card-panel-icon-wrapper icon-course">
          <svg-icon icon-class="article" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            课程总量
          </div>
          <count-to :start-val="0" :end-val="indexData.totalCourse" :duration="3200" class="card-panel-num"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            新课程
          </div>
          <count-to :start-val="0" :end-val="indexData.dayCourse" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(2)">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总销售额
          </div>
          <count-to :decimals="2" :start-val="0" :end-val="indexData.totalCost" :duration="3600" class="card-panel-num"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           销售额
          </div>
          <count-to :decimals="2" :start-val="0" :end-val="indexData.dayCost" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(3)">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单总量
          </div>
          <count-to :start-val="0" :end-val="indexData.totalOrder" :duration="3600" class="card-panel-num"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            新订单
          </div>
          <count-to :start-val="0" :end-val="indexData.dayOrder" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    indexData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      roleId: this.$store.getters.role
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }

}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  text-align: center;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        color: #fff;
        background: #40c9c6;
      }

      .icon-message {
        color: #fff;
        background: #36a3f7;
      }

      .icon-money {
        color: #fff;
        background: #f4516c;
      }
      .icon-course{
        color: #fff;
        background: #E6A23C;
      }
      .icon-shopping {
        color: #fff;
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }
    .icon-course{
      color: #E6A23C;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 26px 26px 0;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    //display: none;
  }

  .card-panel-icon-wrapper {
    display: none;
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
