import { shallowMount } from '@vue/test-utils'
import CanvasPieDataList from '@/components/canvas-pie-data-list/CanvasPieDataList'

describe('CanvasPieDataList.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const list = []
    component = shallowMount(CanvasPieDataList, {
      propsData: { list },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })
})
