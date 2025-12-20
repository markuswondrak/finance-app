import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import WealthConfigPanel from '@/components/WealthConfigPanel.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { wealthService } from '@/services/wealthService'

// Mock the service
vi.mock('@/services/wealthService', () => ({
  wealthService: {
    getProfile: vi.fn(),
    updateProfile: vi.fn()
  }
}))

const vuetify = createVuetify({
  components,
  directives,
})

describe('WealthConfigPanel.vue', () => {
  let wrapper;

  const mockProfile = {
    current_wealth: 50000,
    forecast_duration_years: 20,
    rate_worst_case: 3,
    rate_average_case: 5,
    rate_best_case: 7
  }

  beforeEach(async () => {
    wealthService.getProfile.mockResolvedValue(mockProfile)
    wrapper = mount(WealthConfigPanel, {
      global: {
        plugins: [vuetify]
      }
    })
    // Wait for internal fetching
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
  })

  it('renders expansion panel with title', () => {
    expect(wrapper.text()).toContain('Vermögens-Einstellungen')
  })

  it('loads data from service on mount', () => {
    expect(wealthService.getProfile).toHaveBeenCalled()
    expect(wrapper.vm.profile.current_wealth).toBe(50000)
  })

  it('shows validation error for invalid duration', async () => {
    const durationInput = wrapper.find('input[type="number"]') // Assuming first is wealth, second is duration
    // Actually better to use v-model bindings directly for test
    wrapper.vm.profile.forecast_duration_years = 150
    await wrapper.vm.$nextTick()
    
    // Check if form is valid or save button disabled
    // Assuming the component has a ref to v-form or a computed 'isValid'
    expect(wrapper.vm.isValid).toBe(false)
  })

  it('calls updateProfile when save is clicked', async () => {
    wealthService.updateProfile.mockResolvedValue({...mockProfile, current_wealth: 60000})
    wrapper.vm.profile.current_wealth = 60000
    wrapper.vm.isValid = true // Force valid for test if needed
    
    await wrapper.vm.saveProfile()
    
    expect(wealthService.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      current_wealth: 60000
    }))
  })
})
