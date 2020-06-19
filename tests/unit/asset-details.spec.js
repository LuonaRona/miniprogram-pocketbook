import { shallowMount } from '@vue/test-utils'
import { amount } from '@/utils/index'
import AssetDetails from '@/components/asset-details/AssetDetails'

describe('AssetDetails.vue', () => {
  let component
  let vmComponent

  beforeEach(() => {
    const [netAssets, debtAssets, totalAssets] = [0, 0, 0]
    component = shallowMount(AssetDetails, {
      propsData: { netAssets, debtAssets, totalAssets },
      filters: { amount },
    })
    vmComponent = component.vm
  })

  it('should be component rendered', () => {
    expect(component).toBeTruthy()
  })
})
