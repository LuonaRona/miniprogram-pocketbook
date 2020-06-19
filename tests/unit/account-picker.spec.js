import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import AccountPicker from '@/components/account-picker/AccountPicker'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('AccountPicker.vue', () => {
  let getters
  let store
  let component
  let vmComponent

  beforeEach(() => {
    getters =  {
      getAccountList: () => [
        { _id: 'account_id_1', name: '账户1' },
        { _id: 'account_id_2', name: '账户2' },
        { _id: 'account_id_3', name: '账户3' },
        { _id: 'account_id_4', name: '账户4' },
        { _id: 'account_id_5', name: '账户5' },
      ]
    }

    store = new Vuex.Store({ getters })
    component = mount(AccountPicker, {
      propsData: { accountId: 'account_id_1' },
      store,
      localVue,
    })
    vmComponent = component.vm
  })


  it('component is render truthy', () => {
    expect(component).toBeTruthy()
  })

  it('should be component created', () => {
    expect(vmComponent.currentAccountListIndex).toEqual(0)
  })

  it('should be not incoming props account id', () => {
    component = mount(AccountPicker, {
      propsData: { accountId: 'account_id_null' },
      store,
      localVue,
    })
    vmComponent = component.vm
    
    expect(component.emitted().onSelected[0][0]).toEqual({
      accountId: '', accountName: ''
    })
  })

  it('should be show default account by not account id', () => {
    component = mount(AccountPicker, {
      propsData: { accountId: undefined },
      store,
      localVue,
    })
    vmComponent = component.vm
    
    expect(component.emitted().onSelected[0][0]).toEqual({ accountId: 'account_id_1', accountName: '账户1' })
  })

  it('should be on change account index', () => {
    const event = {
      target: { value: 3 }
    }
    vmComponent.onChange(event)

    expect(vmComponent.currentAccountListIndex).toEqual(event.target.value)
  })
})
