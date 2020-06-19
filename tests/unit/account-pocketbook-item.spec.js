import { shallowMount } from '@vue/test-utils'
import AccountPocketbookItem from '@/components/account-pocketbook-item/AccountPocketbookItem'
import { amount } from '@/utils/index'

describe('AccountPocketbookItem.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const [iconPath, color, description, name, _amount, type] = 
          ['path', 'color', 'desc', 'name', 0, '收入']
    component = shallowMount(AccountPocketbookItem, {
      propsData: { iconPath, color, description, name, amount: _amount, type },
      filters: { amount },
    })
    vmComponent = component.vm
  })


  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be computed is positive integer and total', () => {
    expect(vmComponent.operator).toEqual('+')

    component.setProps({ type: '支出' })
    expect(vmComponent.operator).toEqual('-')
  })
})
