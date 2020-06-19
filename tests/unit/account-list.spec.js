import { shallowMount } from '@vue/test-utils'
import AccountList from '@/components/account-list/AccountList'
import mockUni from './mock/uni'

describe('AccountList.vue', () => {
  window.uni = mockUni
  const list = [{}]
  const component = shallowMount(AccountList, {
    propsData: { list },
  })
  const vmComponent = component.vm

  it('should be component is render truthy', () => {
    expect(component).toBeTruthy()
  })

  it('should be total account number is truthy', () => {
    const accountList = [{}, {}, {}]
    component.setProps({ list: accountList })

    expect(vmComponent.totalAccounts).toEqual(accountList.length)
  })

  it('should be current account set and route to edit', () => {
    vmComponent.setCurrentAccount = jest.fn()
    vmComponent.navigateToDetail({})
    
    expect(uni.navigateTo).toHaveBeenCalled()
    expect(vmComponent.setCurrentAccount).toHaveBeenCalled()
  })

  it('should be current account set and route to add', () => {
    vmComponent.setCurrentAccount = jest.fn()
    vmComponent.navigateToAddAccount()
    
    expect(uni.navigateTo).toHaveBeenCalled()
    expect(vmComponent.setCurrentAccount).toHaveBeenCalled()
  })
})
