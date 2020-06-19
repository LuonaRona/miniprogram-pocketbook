import { mount } from '@vue/test-utils'
import Loading from '@/common/components/loading/Loading'

describe('Loading.vue', () => {
  let component
  let vmComponent
  beforeEach(() => {
    component = mount(Loading)
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })

  it('should be default hide component', () => {
    expect(vmComponent.isShow).toEqual(false)
  })

  it('should be show component by called show function default title', () => {
    vmComponent.show({})

    expect(vmComponent.title).toEqual('loading...')
    expect(vmComponent.isShow).toEqual(true)
  })

  it('should be show component by called show function', () => {
    const title = '正在加载中...'
    vmComponent.show({ title })

    expect(vmComponent.title).toEqual(title)
    expect(vmComponent.isShow).toEqual(true)
  })

  it('should be show component by called show function default title', () => {
    vmComponent.show()

    expect(vmComponent.title).toEqual('loading...')
    expect(vmComponent.isShow).toEqual(true)
  })

  it('should be hide component by called hide function', () => {
    vmComponent.hide()

    expect(vmComponent.title).toEqual('loading...')
    expect(vmComponent.isShow).toEqual(false)
  })
})
