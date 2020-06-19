import { shallowMount } from '@vue/test-utils'
import AccountPocketbookGroup from '@/components/account-pocketbook-group/AccountPocketbookGroup'
import { getDateCnMonthAndDate, formatWeek, amount } from '@/utils/index'

describe('AccountPocketbookGroup.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const [total, date, list] = [200, '2020-06-18', []]
    component = shallowMount(AccountPocketbookGroup, {
      propsData: { total, date, list },
      filters: { getDateCnMonthAndDate, formatWeek, amount },
    })
    vmComponent = component.vm
  })


  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be computed is positive integer by total', () => {
    component.setProps({ total: 100 })
    expect(vmComponent.isPositiveInteger).toEqual(true)

    component.setProps({ total: -100 })
    expect(vmComponent.isPositiveInteger).toEqual(false)
  })
})
