<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24" :sm="10" :md="8" :lg="6" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('profile.profile') }}</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />
                {{ $t('profile.account') }}
                <div class="pull-right">{{ userInfo.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />
                {{ $t('profile.phone') }}
                <div class="pull-right">{{ userInfo.mobile }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />
                {{ $t('profile.email') }}
                <div class="pull-right">{{ userInfo.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />
                {{ $t('profile.role') }}
                <div class="pull-right">
                  {{ userInfo.roleTitle }}
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />
                {{ $t('profile.create') }}
                <div class="pull-right">{{ userInfo.createdAt }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :sm="14" :md="16" :xs="24" :lg="18">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('profile.baseInfo') }}</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('profile.baseInfo')" name="userinfo">
              <userInfo :user="userInfo" @change-link="changeLink" />
            </el-tab-pane>
            <el-tab-pane :label="$t('profile.changePassword')" name="resetPwd">
              <resetPwd :user="userInfo" />
            </el-tab-pane>
            <el-tab-pane v-if="userInfo.roleId === 3" label="讲师信息" name="teacher">
              <resetPwd :user="userInfo" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },

  data() {
    return {
      user: {},
      activeTab: 'userinfo'
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    changeLink(type, link,isUpdateUsername) {
      if (type === 'email') {
        this.userInfo.email = link
      }
      if (type === 'phone') {
        this.userInfo.mobile = link
      }
      if (isUpdateUsername){
        this.userInfo.username =link
      }
    }
  }
}
</script>
