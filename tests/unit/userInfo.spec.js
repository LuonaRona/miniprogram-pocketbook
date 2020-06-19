import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import UserInfo from '@/components/user-info/UserInfo'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('UserInfo.vue', () => {
  let getters
  let store
  let component
  let vmComponent

  beforeEach(() => {
    getters =  {
      userName: () => '九十九分'
    }
    store = new Vuex.Store({ getters })
    component = mount(UserInfo, { store, localVue })
    vmComponent = component.vm
  })


  it('component is render truthy', () => {
    expect(component).toBeTruthy()
  })

  it('should be get user name chart', () => {
    expect(vmComponent.chart).toEqual('J')
  })
})
