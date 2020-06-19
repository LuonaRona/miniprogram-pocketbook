import { shallowMount } from '@vue/test-utils'
import AccountListItem from '@/components/account-list-item/AccountListItem'
import { amount } from '@/utils/index'

describe('AccountListItem.vue', () => {
  const [type, name, iconPath, desc, balance, color] =
        ['default', '账户名称', '账户图标', '账户描述', 0, '账户颜色']
  const component = shallowMount(AccountListItem, {
    propsData: { type, name, iconPath, desc, balance, color },
    filters: { amount }
  })
  const vmComponent = component.vm

  it('should be component is render truthy', () => {
    expect(component).toBeTruthy()
  })

  it('should be default account item', () => {
    expect(vmComponent.isDefault).toEqual(true)
  })

  it('should be add style by type', () => {
    component.setProps({ type: 'add' })

    expect(vmComponent.isDefault).toEqual(false)
  })
})
