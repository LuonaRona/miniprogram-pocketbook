<template>
  <canvas
    id="pie"
    canvas-id="pie"
    class="charts"
    @touchstart="touchCanvas($event)">
  </canvas>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js'

let _self = undefined
let canvasPie = null

export default {
  name: 'canvas-pie',
  props: ['pieData', 'width', 'height'],
  data() {
    return {
      cWidth: 0,
      cHeight: 0,
    }
  },
  watch: {
    pieData: {
      handler: function(value) {
        this.showCanvas(value)
      },
      deep: true
    },
  },
  methods: {
    showCanvas(data) {
      const colors = ['#1890ff', '#2fc25b', '#facc14', '#f04864', '#8543e0', '#90ed7d']
      if (this.width && this.height) {
        _self.cWidth = uni.upx2px(this.width)
        _self.cHeight = uni.upx2px(this.height)
      }

      if (canvasPie) {
        canvasPie.updateData({
          title: {
            name: data.total,
          },
          subtitle: {
            name: data.title,
          },
          series: data.series,
          width: _self.cWidth,
          height: _self.cHeight,
          colors,
        })
      }

      canvasPie = new uCharts({
        $this: _self,
        canvasId: 'pie',
        type: 'ring',
        fontSize: 11,
        title: {
          name: data.total,
          color: '#333',
          fontSize: 18,
        },
        subtitle: {
          name: data.title,
          color: '#999',
          fontSize: 12,
        },
        legend: {
          show: true,
          lineHeight: 20,
        },
        background: '#FFFFFF',
        series: data.series,
        pixelRatio: 1,
        animation: true,
        width: _self.cWidth,
        height: _self.cHeight,
        animation: true,
        dataLabel: true,
        extra: {
          pie: {
            offsetAngle: 45,
            lableWidth: 15,
            ringWidth: 20
          },
          tooltip: {
            bgOpacity: 0.5,
          },
        },
      });
    },
    touchCanvas(e) {
      canvasPie.showToolTip(e, {
        format: item => `${item.name} : ${item.data}`
      });
    },
  },
  created() {
    _self = this
    this.showCanvas(this.pieData)
  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>