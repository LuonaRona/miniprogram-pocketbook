import { shallowMount } from '@vue/test-utils'
import PocketbookButton from '@/components/pocketbook-button/PocketbookButton'

describe('PocketbookButton.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    component = shallowMount(PocketbookButton)
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })
})
