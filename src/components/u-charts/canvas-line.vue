<template>
  <canvas
    id="line"
    canvas-id="line"
    class="charts"
    @touchstart="touchCanvas($event)">
  </canvas>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js'

let _self = undefined
let canvasLine = null

export default {
  name: 'canvas-line',
  props: ['lineData', 'width', 'height'],
  data() {
    return {
      cWidth: 0,
      cHeight: 0,
    }
  },
  watch: {
    lineData: {
      handler: function(value) {
        this.showCanvas(value)
      },
      deep: true
    },
  },
  methods: {
    showCanvas({ categories, series }) {
      const colors = ['#1890ff', '#2fc25b', '#facc14', '#f04864', '#8543e0', '#90ed7d']
      if (this.width && this.height) {
        _self.cWidth = uni.upx2px(this.width)
        _self.cHeight = uni.upx2px(this.height)
      }
      if (canvasLine) {
        canvasLine.updateData({
          categories,
          series,
          width: _self.cWidth,
          height: _self.cHeight,
          colors,
        })
      }

      canvasLine = new uCharts({
        $this: _self,
        canvasId: 'line',
        type: 'line',
        fontSize: 11,
        legend: { show: true },
        background: '#FFFFFF',
        categories,
        series,
        animation: true,
        width: _self.cWidth,
        height: _self.cHeight,
        dataLabel: false,
        dataPointShape: true,
        xAxis: {
          disableGrid: true,
          labelCount: 7,
        },
        yAxis: {
          gridType: 'dash',
          gridColor: '#eee',
          dashLength: 8,
          splitNumber: 4,
        },
        extra: {
          line: {
            width: 1
          },
          tooltip: {
            bgOpacity: 0.5,
          },
        },
      });
    },
    touchCanvas(e) {
      canvasLine.showToolTip(e, {
        format: item => `${item.name} : ${item.data}`
      });
    },
  },
  created() {
    _self = this
    this.showCanvas(this.lineData)
  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>