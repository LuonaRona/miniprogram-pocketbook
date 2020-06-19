import { mount } from '@vue/test-utils'
import { amount } from '@/utils/index'
import AccountDetailCard from '@/components/account-detail-card/AccountDetailCard'

describe('AccountDetailCard.vue', () => {
  const filters = { amount }
  const [ balance, inTotal, outTotal, bgColor, year ] =
        [ 100, 200, 500, 'bgColor', new Date().getFullYear() ]
  const component = mount(AccountDetailCard, {
    propsData: { balance, inTotal, outTotal, bgColor, year },
    filters
  })
  const vmComponent = component.vm

  it('component is render truthy', () => {
    expect(component).toBeTruthy()
  })

  it('year is current year', () => {
    expect(vmComponent.isCurrentYear).toBeTruthy()
    expect(vmComponent._balance).toEqual(balance)
  })

  it('year is not current year', () => {
    component.setProps({ year: 2019 })

    expect(vmComponent.isCurrentYear).toBeFalsy()
    expect(vmComponent._balance).toEqual(inTotal - outTotal)
  })
})
