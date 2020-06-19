import { shallowMount } from '@vue/test-utils'
import { amount } from '@/utils/index'
import MonthTotal from '@/components/month-total/MonthTotal'

describe('MonthTotal.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    component = shallowMount(MonthTotal, {
      propsData: {},
      filters: { amount },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })
})
