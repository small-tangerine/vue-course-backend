<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin'
import defaultDashboard from './default'
export default {
  name: 'Dashboard',
  components: { adminDashboard ,defaultDashboard},
  data() {
    return {
      currentRole: this.$store.getters.currentRole
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
