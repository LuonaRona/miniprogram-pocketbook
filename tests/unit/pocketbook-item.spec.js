import { shallowMount } from '@vue/test-utils'
import PocketbookItem from '@/components/pocketbook-item/PocketbookItem'
import { amount } from '@/utils/index'

describe('PocketbookItem.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const [iconPath, color, typeName, _amount, description, automatic, showDirection, routeLink] =
          ['path', 'color', 'name', 0, 'desc', false, 'ltr', '']
    component = shallowMount(PocketbookItem, {
      propsData: { iconPath, color, typeName, amount: _amount, description, automatic, showDirection, routeLink },
      filters: { amount }
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })
})
