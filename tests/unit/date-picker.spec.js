import { shallowMount } from '@vue/test-utils'
import DatePicker from '@/components/date-picker/DatePicker'
import { getStartDate, getEndDate, formatDate } from '@/utils/index'

describe('DatePicker.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    component = shallowMount(DatePicker, {
      propsData: {},
      filters: { getStartDate, getEndDate, formatDate },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be on change', () => {
    const event = { target: { value: 2 } }
    vmComponent.onChange(event)

    expect(component.emitted().onSelected[0][0]).toEqual(2)
  })
})
