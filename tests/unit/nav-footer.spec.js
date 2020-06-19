import { shallowMount } from '@vue/test-utils'
import mockUni from './mock/uni'
import NavFooter from '@/components/nav-footer/NavFooter'

describe('NavFooter.vue', () => {
  window.uni = mockUni
  const getCurrentPages = jest.fn()
  getCurrentPages.mockReturnValue([{ route: '' }])
  window.getCurrentPages = getCurrentPages
  let component
  let vmComponent

  beforeEach(() => {
    component = shallowMount(NavFooter)
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be computed current route url', () => {
    component.setData({
      currentRouteUrl: 'pages/tab-bar/PocketBook'
    })
    expect(vmComponent.isPocketbook).toEqual(true)
    expect(vmComponent.isReportCharts).toEqual(false)
    expect(vmComponent.isAssetManagement).toEqual(false)

    component.setData({
      currentRouteUrl: 'pages/tab-bar/ReportCharts'
    })
    expect(vmComponent.isPocketbook).toEqual(false)
    expect(vmComponent.isReportCharts).toEqual(true)
    expect(vmComponent.isAssetManagement).toEqual(false)

    component.setData({
      currentRouteUrl: 'pages/tab-bar/AssetManagement'
    })
    expect(vmComponent.isPocketbook).toEqual(false)
    expect(vmComponent.isReportCharts).toEqual(false)
    expect(vmComponent.isAssetManagement).toEqual(true)
  })

  it('should be switch tab by router', () => {
    vmComponent.toPocketbook()
    expect(uni.switchTab).toHaveBeenCalledTimes(1)

    vmComponent.toReportCharts()
    expect(uni.switchTab).toHaveBeenCalledTimes(2)

    vmComponent.toAssetManagement()
    expect(uni.switchTab).toHaveBeenCalledTimes(3)
  })
})
