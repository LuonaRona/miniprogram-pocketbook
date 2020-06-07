<template>
  <view class="nav-footer">
    <view class="cu-bar tabbar bg-white">
      <view class="action" @click="toPocketbook">
        <view class="cuIcon-cu-image">
          <image src="/static/pocket-book-h.png" v-if="isPocketbook"></image>
          <image src="/static/pocket-book.png" v-else></image>
        </view>
        <view :class="isPocketbook ? 'text-primary' : 'text-gray'">记账</view>
      </view>
      <view class="action" @click="toReportCharts">
        <view class="cuIcon-cu-image">
          <image src="/static/report-charts-h.png" v-if="isReportCharts"></image>
          <image src="/static/report-charts.png" v-else></image>
        </view>
        <view :class="isReportCharts ? 'text-primary' : 'text-gray'">报表</view>
      </view>
      <view class="action" @click="toAssetManagement">
        <view class="cuIcon-cu-image">
          <image src="/static/asset-management-h.png" v-if="isAssetManagement"></image>
          <image src="/static/asset-management.png" v-else></image>
        </view>
        <view :class="isAssetManagement ? 'text-primary' :'text-gray'">资产</view>
      </view>
    </view>
  </view>
</template>
<script>
import * as _ from 'lodash'

export default {
  name: 'nav-footer',
  data() {
    return {
      currentRouteUrl: '',
    }
  },
  computed: {
    isPocketbook() {
      return this.currentRouteUrl === 'pages/tab-bar/PocketBook'
    },
    isReportCharts() {
      return this.currentRouteUrl === 'pages/tab-bar/ReportCharts'
    },
    isAssetManagement() {
      return this.currentRouteUrl === 'pages/tab-bar/AssetManagement'
    }
  },
  methods: {
    toPocketbook() {
      uni.switchTab({
        url: '/pages/tab-bar/PocketBook',
      })
    },
    toReportCharts() {
      uni.switchTab({
        url: '/pages/tab-bar/ReportCharts',
      })
    },
    toAssetManagement() {
      uni.switchTab({
        url: '/pages/tab-bar/AssetManagement',
      })
    },
  },
  created() {
    this.currentRouteUrl =  _.last(getCurrentPages()).route
  },
}
</script>
<style lang="scss" scoped>
.nav-footer {
  box-shadow: 0 0 2px rgba(0, 0, 0, .1);
}
</style>