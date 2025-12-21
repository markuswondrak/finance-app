import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import MonthYearDatepicker from '@/components/common/MonthYearDatepicker.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

describe('MonthYearDatepicker.vue', () => {
  let wrapper;

  beforeEach(() => {
    // In many Vitest environments, VMenu portals can be tricky.
    // We can try to test the internal methods if the DOM interaction is too flaky.
    wrapper = mount(MonthYearDatepicker, {
      global: {
        plugins: [vuetify]
      },
      attachTo: document.body
    })
  })

  it('renders correctly with default label', () => {
    expect(wrapper.text()).toContain('Select Date')
  })

  it('displays the formatted date when modelValue is provided', async () => {
    const date = new Date(2025, 0, 1) // Jan 2025
    await wrapper.setProps({ modelValue: date })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('January 2025')
  })

  it('navigates years correctly', async () => {
    // Access VM directly to change year and verify state
    expect(wrapper.vm.currentViewYear).toBe(new Date().getFullYear())
    wrapper.vm.changeYear(1)
    expect(wrapper.vm.currentViewYear).toBe(new Date().getFullYear() + 1)
  })

  it('emits update:modelValue when a month is selected', async () => {
    // Trigger internal selection method to verify emission logic
    const monthIndex = 5 // June
    const currentYear = wrapper.vm.currentViewYear
    
    wrapper.vm.selectMonth(monthIndex)
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedDate = wrapper.emitted('update:modelValue')[0][0]
    expect(emittedDate.getMonth()).toBe(monthIndex)
    expect(emittedDate.getFullYear()).toBe(currentYear)
    expect(wrapper.vm.menuOpen).toBe(false)
  })
})
