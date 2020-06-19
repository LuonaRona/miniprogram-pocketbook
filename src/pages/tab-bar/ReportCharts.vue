<template>
  <view class="page">
    <cu-custom bgColor="bg-primary-light" :isBack="false">
      <block slot="backText">
        <user-info></user-info>
      </block>
      <block slot="content">报表</block>
    </cu-custom>
    <view class="section">
      <view class="filtor">
        <view class="date">
          <image class="date-icon" src="/static/filtor.png"></image>
          <text class="date-text">时间</text>
        </view>
        <view class="period">
          <view class="period-item"
            v-for="item in monthList"
            :key="item.month"
            :class="{'actived': selectedDate === item.month}"
            @click="changeDateByMonth(item.month)">{{ item.month }}月</view>
          <view class="period-item"
            :class="{'actived': selectedDate === currentYear}"
            @click="changeDateByYear()">{{ currentYear }}</view>
          <view class="period-item"
            :class="{'actived': isDateAll}"
            @click="changeDateByAll()">合计</view>
        </view>
      </view>
      <view class="total-filter">
        <view class="total-filter-item"
          :class="{'actived': selectedType === '支出'}"
          @click="changeType('支出')">
          <view class="amount">{{ total.out | amount }}</view>
          <view class="label">总支出</view>
        </view>
        <view class="total-filter-item"
          :class="{'actived': selectedType === '收入'}"
          @click="changeType('收入')">
          <view class="amount">{{ total.in | amount }}</view>
          <view class="label">总收入</view>
        </view>
        <view class="total-filter-item"
          :class="{'actived': isCashSurplus }"
          @click="getCashSurplus()">
          <view class="amount">{{ cashSurplusTotal | amount }}</view>
          <view class="label">总结余</view>
        </view>
      </view>
      <view class="ucharts">
        <view class="ucharts-type btn-group">
          <view
            class="button"
            :class="{'actived': isPieCharts()}"
            @click="changeCharts('pie')">饼图</view>
          <view
            class="button"
            :class="{'actived': isLineCharts()}"
            @click="changeCharts('line')">折线图</view>
        </view>
        <view class="ucharts-content">
          <canvas-pie
            class="canvas"
            :pieData="pieData"
            :width="cWidth"
            :height="cHeight"
            v-if="isPieCharts() && pieData.series && pieData.series.length">
          </canvas-pie>
          <canvas-line
            class="canvas"
            :lineData="lineData"
            :width="cWidth"
            :height="cHeight"
            v-else-if="isLineCharts() && currentList && currentList.length">
          </canvas-line>
          <div class="empty-text" v-else>当前没有记录哦！</div>
        </view>
      </view>
      <canvas-pie-data-list :list="pieData.series"
        v-if="isPieCharts() && !isCashSurplus">
      </canvas-pie-data-list>
      <canvas-line-data-list
        :list="lineData.templateData"
        v-if="isLineCharts() && lineData.templateData">
      </canvas-line-data-list>
    </view>
  </view>
</template>
<script>
import * as _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import { precision, formatDay } from '@/utils/index'
import CanvasPie from '@/components/u-charts/canvas-pie'
import CanvasLine from '@/components/u-charts/canvas-line'
import CanvasLineDataList from '@/components/canvas-line-data-list/CanvasLineDataList'
import CanvasPieDataList from '@/components/canvas-pie-data-list/CanvasPieDataList'

const now = new Date()
export default {
  name: 'report-charts',
  data() {
    return {
      cWidth: 0,
      cHeight: 0,
      currentList: [],
      total: {
        in: 0,
        out: 0,
      },
      selectedDate: now.getMonth() + 1,
      currentYear: now.getFullYear(),
      selectedType: '收入',
      currentChartsType: 'pie',
    }
  },
  computed: {
    ...mapState(['months']),
    ...mapGetters({
      pocketbookList: 'getPocketbookList',
    }),
    monthList() {
      const currentMonths = _.filter(this.months, ['year', this.currentYear])
      return _.sortBy(currentMonths, 'month')
    },
    cashSurplusTotal() {
      return precision(this.total.in) - precision(this.total.out)
    },
    isCashSurplus() {
      return _.isEqual(this.selectedType, '结余')
    },
    isDateAll() {
      return _.isEqual(this.selectedDate, 9999)
    },
    pieData() {
      const list = this.currentList
      const isCashSurplus = this.isCashSurplus

      if (isCashSurplus) {
        const data = this.formatDataByPieOfCashSurplus(list)
        const total = _.sumBy(data, item => item.data * (item.name === '总收入' ? 1 : -1))
        return {
          total: precision(total),
          title: '总结余',
          series: data,
        }
      }

      return {
        total: precision(_.sumBy(list, 'amount')),
        title: `总${this.selectedType}`,
        series: _.sortBy(this.formatDataByPie(list), item => -item.data)
      }
    },
    lineData() {
      const list = this.currentList
      const isCashSurplus = this.isCashSurplus
      const categories = this.getCategories()
      const outCurrentList = this.formatDataByLine(_.filter(list, ['type', '支出']))
      const inCurrentList = this.formatDataByLine(_.filter(list, ['type', '收入']))
      const cashSurplusList = this.getCashSurplusCurrentList(inCurrentList, outCurrentList)
      const templateData = _.sortBy(this.formatDataByTemplate(this.getListBySelectedDate()), 'date')

      if (isCashSurplus) {
        return {
          categories,
          series: [
            {
              name: '总支出',
              data: outCurrentList,
              color: '#409EFF',
            }, {
              name: '总收入',
              data: inCurrentList,
              color: '#67C23A',
            }, {
              name: '总结余',
              data: cashSurplusList,
              color: '#E6A23C',
            },
          ],
          templateData,
        }
      }

      return {
        categories,
        series: [
          {
            name: `总${this.selectedType}`,
            data: this.formatDataByLine(list),
            color: _.isEqual(this.selectedType, '收入') ? '#67C23A' : '#409EFF',
          }
        ],
        templateData,
      }
    },
  },
  methods: {
    isPieCharts() {
      return _.isEqual(this.currentChartsType, 'pie')
    },
    isLineCharts() {
      return _.isEqual(this.currentChartsType, 'line')
    },
    changeCharts(type) {
      this.currentChartsType = type
    },
    changeDateByMonth(month) {
      const list = this.pocketbookList
      const isCashSurplus = this.isCashSurplus
      this.currentList = isCashSurplus ?
        this.filterListByMonth(list, month) : 
        this.filterListByType(this.filterListByMonth(list, month), this.selectedType)
      this.selectedDate = month
      this.total = this.getInOutTotal()
    },
    changeDateByYear() {
      const list = this.pocketbookList
      const isCashSurplus = this.isCashSurplus

      this.currentList = isCashSurplus ?
        this.filterListByYear(list) :
        this.filterListByType(this.filterListByYear(list), this.selectedType)
      this.selectedDate = this.currentYear
      this.total = this.getInOutTotal()
    },
    changeDateByAll() {
      const list = this.pocketbookList
      const isCashSurplus = this.isCashSurplus

      this.currentList = isCashSurplus ? list : this.filterListByType(list, this.selectedType)
      this.selectedDate = 9999
      this.total = this.getInOutTotal()
    },
    changeType(type) {
      this.currentList = this.filterListByType(this.getListBySelectedDate(), type)
      this.selectedType = type
    },
    getCashSurplus() {
      this.currentList = this.getListBySelectedDate()
      this.selectedType = '结余'
    },
    filterListByType(list, type) {
      return _.filter(list, { type })
    },
    filterListByMonth(list, month) {
      return _.filter(list, {
        current_year: this.currentYear,
        current_month: month,
      })
    },
    filterListByYear(list) {
      return _.filter(list, {
        current_year: this.currentYear
      })
    },
    getListBySelectedDate() {
      const list = this.pocketbookList
      if (this.isDateAll) return list

      const selectedDate = this.selectedDate
      const isSelectedYear = _.isEqual(selectedDate, this.currentYear)

      return isSelectedYear ?
        this.filterListByYear(list) :
        this.filterListByMonth(list, selectedDate)
    },
    getInOutTotal() {
      const groupByType = _.groupBy(this.getListBySelectedDate(), 'type')

      return {
        in: _.sumBy(groupByType['收入'], 'amount'),
        out: _.sumBy(groupByType['支出'], 'amount')
      }
    },
    getCategories() {
      const isDateAll = this.isDateAll
      const isSelectedYear = _.isEqual(this.selectedDate, this.currentYear)
      const getMaxDays = (year, month) => {
        return new Date(year, month, 0).getDate()
      }
      const array = []

      if (isDateAll) {
        const list = _.sortBy(this.pocketbookList, item =>
          new Date(item.current_year, item.current_month + 1, item.current_day).getTime())
        list.forEach(item => {
          const { current_year, current_month, current_day } = item
          array.push(formatDay(current_day, current_month, current_year))
        })

        return [...new Set(array)]
      }
      
      if (isSelectedYear) {
        for (let i = 1; i <= 12; i += 1) {
          const maxDays = getMaxDays(this.currentYear, i)
          for (let j = 1; j <= maxDays; j += 1) {
            array.push(formatDay(j, i))
          }
        }

        return array
      }
      
      const maxDays = getMaxDays(this.currentYear, this.selectedDate)
      for (let i = 1; i <= maxDays; i += 1) {
        array.push(formatDay(i))
      }
      return array
    },
    formatDataByPie(list) {
      const groupByName = _.groupBy(list, 'name')
      const total = _.sumBy(list, 'amount')

      return _.map(groupByName, (value, key) => {
        const sum = parseFloat(precision(_.sumBy(value, 'amount')))
        const num = (sum / total * 100)
        const percentage = _.isNaN(num) ? '100%': num.toFixed(1) + '%'
        const { path, color } = _.head(value)
        return {
          name: key,
          data: sum,
          percentage,
          path,
          color
        }
      })
    },
    formatDataByPieOfCashSurplus(list) {
      const groupByType = _.groupBy(list, 'type')
      const total = _.sumBy(list, 'amount')

      return _.map(groupByType, (value, key) => {
        const data = parseFloat(precision(_.sumBy(value, 'amount')))
        return { name: `总${key}`, data }
      })
    },
    formatDataByTemplate(list) {
      const groupByDate = _.groupBy(list, item =>
        `${item.current_year}.${item.current_month}.${item.current_day}`)
      const isMonth = this.selectedDate <= 12
      
      return _.map(groupByDate, (value, key) => {
        const item = _.head(value)
        const date = isMonth ?
                     formatDay(item.current_day) :
                     formatDay(item.current_day, item.current_month, item.current_year)
        const inList = _.filter(value, ['type', '收入'])
        const inTotal = _.sumBy(inList, 'amount')
        const outList = _.filter(value, ['type', '支出'])
        const outTotal = _.sumBy(outList, 'amount')
        const cashSurplusTotal = inTotal - outTotal

        return { date, outTotal, inTotal, cashSurplusTotal }
      })
    },
    formatDataByLine(list) {
      const categories = this.getCategories()
      const groupByDate = _.groupBy(list, item =>
        `${item.current_year}.${item.current_month}.${item.current_day}`)
      const array = _.map(categories, v => 0)
      
      _.forEach(groupByDate, (value, key) => {
        const item = _.head(value)
        const isMonth = this.selectedDate <= 12
        const dayStr = isMonth ? formatDay(item.current_day) :
          formatDay(item.current_day, item.current_month, item.current_year)
        const index = _.findIndex(categories, v => _.isEqual(v, dayStr))
        const total = _.sumBy(value, 'amount')
        array[index] = total
      })
      return array
    },
    getCashSurplusCurrentList(inList, outList) {
      return _.map(inList, (value, index) => {
        return precision(value) - outList[index]
      })
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.isDateAll) {
        this.changeDateByAll()
      } else {
        this.changeDateByMonth(this.selectedDate)
      }
    }, 100);
  },
  onShow() {
    wx.createSelectorQuery().selectViewport().scrollOffset()
      .exec(([{ scrollWidth, scrollHeight }]) => {
        this.cWidth = scrollWidth * 2
        this.cHeight = scrollHeight * 2 - 838
      })
  },
  components: { CanvasPie, CanvasLine, CanvasPieDataList, CanvasLineDataList }
}
</script>
<style lang="scss" scoped>
.filtor, .total-filter, .ucharts, .list {
  box-sizing: border-box;
}

.filtor {
  height: 45px;
  font-size: 12px;
  border-bottom: 1px solid $light-grey;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  padding: 0 .5rem 0 .1rem;
  border-right: 1px solid $light-grey;
  white-space: nowrap;

  &-icon {
    width: 25px;
    height: 25px;
  }

  .date-icon, .date-text {
    vertical-align: middle;
  }
}

.period {
  flex: 1 1 auto;
  display: inline-flex;
  align-items: center;
  line-height: 30px;
  overflow-x: auto;

  &-item {
    text-align: center;
    flex: 1 1 auto;
    min-width: 50px;
    cursor: pointer;

    &.actived {
      color: $primary-color;
    }
  }
}

.total-filter {
  height: 75px;
  border-bottom: 1px solid $light-grey;
  display: flex;
  justify-content: center;
  align-items: center;

  &-item {
    text-align: center;
    flex: 1;
    cursor: pointer;

    &.actived {
      color: $primary-color;

      .label {
        color: $primary-color;
      }
    }

    .amount {
      font-size: 20px;
    }

    .label {
      color: $secondary-text;
      font-size: 13px;
    }
  }
}

.ucharts {
  height: calc(100% - 300px);
  overflow: hidden;
  border-bottom: 1px solid $light-grey;

  .btn-group {
    margin: 5px 0;
    text-align: center;

    .button {
      position: relative;
      width: 65px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      font-size: 14px;
      color: $secondary-text;
      border: 1px solid;
      display: inline-block;
      z-index: 1;
      box-sizing: border-box;
      cursor: pointer;

      &:first-of-type {
        margin-right: -1px;
        border-radius: 16px 0 0 16px;
      }

      &:last-of-type {
        border-radius: 0 16px 16px 0;
      }

      &.actived {
        color: $primary-color;
        z-index: 2;
      }
    }
  }

  &-content {
    position: relative;
    height: calc(100% - 30px);

    .canvas {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.empty-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  color: #606266;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  display: block;
}
</style>