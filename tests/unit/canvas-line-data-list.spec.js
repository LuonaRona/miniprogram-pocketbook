import { shallowMount } from '@vue/test-utils'
import CanvasLineDataList from '@/components/canvas-line-data-list/CanvasLineDataList'

describe('CanvasLineDataList.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const list = []
    component = shallowMount(CanvasLineDataList, {
      propsData: { list },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })
})
