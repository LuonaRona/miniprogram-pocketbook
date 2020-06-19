import { mount } from '@vue/test-utils'
import Message from '@/common/components/message/Message'

describe('Message.vue', () => {
  const component = mount(Message)
  const vmComponent = component.vm

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be default not show component', () => {
    expect(vmComponent.isShow).toEqual(false)
  })

  it('should not show component by message is empty', () => {
    vmComponent.show({})

    expect(vmComponent.isShow).toEqual(false)
  })

  it('should be show component by called show function', () => {
    const [message, type] = ['模拟消息提示']
    vmComponent.show({ message, type })

    expect(vmComponent.message).toEqual(message)
    expect(vmComponent.type).toEqual('info')
    expect(vmComponent.iconClass).toEqual('cuIcon-infofill')
    expect(vmComponent.colorStyle).toEqual('color: #909399;background-color: #edf2fc;border-color: #d3d4d6')
    expect(vmComponent.isShow).toEqual(true)
  })

  it('should be show component by called show function', () => {
    const [message, type] = ['模拟消息提示2', 'success']
    vmComponent.show({ message, type })

    expect(vmComponent.message).toEqual(message)
    expect(vmComponent.type).toEqual(type)
    expect(vmComponent.iconClass).toEqual('cuIcon-roundcheckfill')
    expect(vmComponent.colorStyle).toEqual('color: #67C23A;background-color: #f0f9eb;border-color: #c2e7b0')
    expect(vmComponent.isShow).toEqual(true)
  })

  it('should be hide component by called hide function', () => {
    vmComponent.hide()

    expect(vmComponent.isShow).toEqual(false)
  })
})
