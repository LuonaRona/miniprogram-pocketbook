import { shallowMount } from '@vue/test-utils'
import TimedAutoRecordList from '@/components/timed-auto-record-list/TimedAutoRecordList'

describe('TimedAutoRecordList.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    component = shallowMount(TimedAutoRecordList, {
      propsData: { list: [] },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be on change handle', () => {
    const event = { target: { value: true }}
    const item = { data: 2 }
    vmComponent.onChange(event, item)

    expect(component.emitted().onSwitchChange[0][0]).toEqual({
      data: 2, checked: true
    })
  })
})
