import { mount } from '@vue/test-utils'
import CuModal from '@/common/components/cu-modal/CuModal'

describe('CuModal.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    component = mount(CuModal, {
      propsData: {},
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be props get default value', () => {
    expect(vmComponent.modalTitle).toEqual('提示')
    expect(vmComponent.showCloseButton).toEqual(true)
    expect(vmComponent.confirm).toEqual(false)
    expect(vmComponent.visible).toEqual(false)
  })

  it('should be props by incoming props', () => {
    const [ modalTitle, showCloseButton, confirm, visible] = 
          [ '标题', false, true, true ]
    component.setProps({ modalTitle, showCloseButton, confirm, visible })

    expect(vmComponent.modalTitle).toEqual(modalTitle)
    expect(vmComponent.showCloseButton).toEqual(showCloseButton)
    expect(vmComponent.confirm).toEqual(confirm)
    expect(vmComponent.visible).toEqual(visible)
  })

  it('should be call function hide modal', () => {
    vmComponent.hideModal()

    expect(vmComponent.visible).toEqual(false)
  })
})
