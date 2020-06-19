import { shallowMount } from '@vue/test-utils'
import AccountPocketbookGroups from '@/components/account-pocketbook-groups/AccountPocketbookGroups'
import { zeroPadding, amount } from '@/utils/index'

describe('AccountPocketbookGroups.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const [month, year, inTotal, outTotal, list, defaultShow] = 
          [1, new Date().getFullYear(), 100, 200, [], false]
    component = shallowMount(AccountPocketbookGroups, {
      propsData: { month, year, inTotal, outTotal, list, defaultShow },
      filters: { zeroPadding, amount },
    })
    vmComponent = component.vm
  })


  it('should be component rendered', () => {
    expect(component).toBeTruthy()
    expect(vmComponent.isShow).toEqual(false)
  })

  it('should be computed is positive integer and total', () => {
    component.setProps({ inTotal: 100, outTotal: 200 })
    expect(vmComponent.total).toEqual(-100)
    expect(vmComponent.isPositiveInteger).toEqual(false)

    component.setProps({ inTotal: 200, outTotal: 100 })
    expect(vmComponent.total).toEqual(100)
    expect(vmComponent.isPositiveInteger).toEqual(true)
  })
})
