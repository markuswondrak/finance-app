import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

describe('AppSidebar.vue', () => {
  it('renders navigation drawer', () => {
    // v-navigation-drawer needs VLayout or VApp to work
    const wrapper = mount({
      template: '<v-layout><AppSidebar :model-value="true" :rail="false" /></v-layout>',
      components: { AppSidebar }
    }, {
      global: {
        plugins: [vuetify],
      }
    })
    expect(wrapper.findComponent({ name: 'v-navigation-drawer' }).exists()).toBe(true)
  })

  it('renders navigation items', () => {
    const wrapper = mount({
      template: '<v-layout><AppSidebar :model-value="true" :rail="false" /></v-layout>',
      components: { AppSidebar }
    }, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    
    // Check if at least one list item exists
    expect(wrapper.findAll('.v-list-item').length).toBeGreaterThan(0)
  })
  
  // Note: Testing actual active state often requires a real router or mocking the route.
  // For unit testing the component's CSS application, we might rely on props or manual class checks if we control the active state logic manually,
  // but Vuetify handles 'active-class' automatically via Vue Router. 
  // We can verify that we are passing the correct `active-class` prop to v-list-item.
  it('applies custom active class to list items', () => {
     const wrapper = mount({
      template: '<v-layout><AppSidebar :model-value="true" :rail="false" /></v-layout>',
      components: { AppSidebar }
    }, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    
    const items = wrapper.findAllComponents({ name: 'v-list-item' })
    if (items.length > 0) {
      expect(items[0].props('activeClass')).toContain('nav-item-active')
    }
  })

  it('renders branding and adjusts for rail mode', async () => {
    const wrapper = mount({
      template: '<v-layout><AppSidebar :model-value="true" :rail="rail" /></v-layout>',
      components: { AppSidebar },
      data: () => ({ rail: false })
    }, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    
    // Check if branding title exists
    expect(wrapper.text()).toContain('Finanz-App')
    
    // Switch to rail mode
    await wrapper.setData({ rail: true })
    
    // In rail mode, text should be hidden
    expect(wrapper.text()).not.toContain('Finanz-App')
    
    const sidebar = wrapper.findComponent(AppSidebar)
    expect(sidebar.props('rail')).toBe(true)
  })

  it('renders all navigation items as flat list', () => {
    const wrapper = mount({
      template: '<v-layout><AppSidebar :model-value="true" :rail="false" /></v-layout>',
      components: { AppSidebar }
    }, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    // Check all 4 navigation items are rendered
    expect(wrapper.text()).toContain('Überblick')
    expect(wrapper.text()).toContain('Vermögen')
    expect(wrapper.text()).toContain('Fixkosten')
    expect(wrapper.text()).toContain('Sonderkosten')

    const items = wrapper.findAllComponents({ name: 'v-list-item' })
    expect(items.length).toBe(7)
  })
})
