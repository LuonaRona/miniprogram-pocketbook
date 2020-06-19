import { shallowMount } from '@vue/test-utils'
import PocketbookTypeTab from '@/components/pocketbook-type-tab/PocketbookTypeTab'

describe('PocketbookTypeTab.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const type = '收入'
    component = shallowMount(PocketbookTypeTab, {
      propsData: { type },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be computed is income', () => {
    expect(vmComponent.isIncome).toEqual(true)

    component.setProps({ type: '支出' })
    expect(vmComponent.isIncome).toEqual(false)
  })
})
