import { shallowMount } from '@vue/test-utils'
import { amount, formatDate } from '@/utils/index'
import PocketbookList from '@/components/pocketbook-list/PocketbookList'
import mockUni from './mock/uni'

describe('PocketbookList.vue', () => {
  let component
  let vmComponent
  window.uni = mockUni

  beforeEach(() => {
    const list = []
    component = shallowMount(PocketbookList, {
      propsData: { list },
      filters: { amount, formatDate }
    })
    vmComponent = component.vm
    vmComponent.setCurrentPocketbook = jest.fn()
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be navigate to pocketbook page', () => {
    vmComponent.navigateToPocketbook()
    expect(uni.navigateTo).toHaveBeenCalled()
  })

  it('should be navigate to edit page', () => {
    vmComponent.navigateToEdit({})

    expect(uni.navigateTo).toHaveBeenCalled()
    expect(vmComponent.setCurrentPocketbook).toHaveBeenCalled()
  })

  it('should be get is today', () => {
    const now = new Date()
    const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
    expect(vmComponent.isToday(date)).toEqual(true)

    expect(vmComponent.isToday('2020/01/01')).toEqual(false)
  })
})
