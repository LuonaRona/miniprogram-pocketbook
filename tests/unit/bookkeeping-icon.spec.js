import { shallowMount } from '@vue/test-utils'
import BookkeepingIcon from '@/components/bookkeeping-icon/BookkeepingIcon'

describe('BookkeepingIcon.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const [path, name, color, isActived, badgeIconPath] = 
          ['path', 'name', 'color', false, 'badge-path']
    component = shallowMount(BookkeepingIcon, {
      propsData: { path, name, color, isActived, badgeIconPath },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })
})
