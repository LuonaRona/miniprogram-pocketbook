import { shallowMount } from '@vue/test-utils'
import CreateUser from '@/components/create-user/CreateUser'

describe('CreateUser.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    component = shallowMount(CreateUser)
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be computed name invalid', () => {
    component.setData({ name: '' })
    expect(vmComponent.nameInvalid).toEqual(true)

    component.setData({ name: '123' })
    expect(vmComponent.nameInvalid).toEqual(false)

    component.setData({ name: '长度超过16长度超过16长度超过16长度超过16' })
    expect(vmComponent.nameInvalid).toEqual(true)
  })

  it('should be handle modal display function', () => {
    vmComponent.showModal()
    expect(vmComponent.isShow).toEqual(true)

    vmComponent.hideModal()
    expect(vmComponent.isShow).toEqual(false)
  })

  it('should not submit name by name invalid', () => {
    component.setData({ name: '' })
    vmComponent.submit()

    expect(component.emitted()).toEqual({})
  })

  it('should not submit name by name invalid', () => {
    component.setData({ name: '九十九分' })
    vmComponent.submit()

    expect(component.emitted().submit[0][0]).toEqual('九十九分')
  })
})
