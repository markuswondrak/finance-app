import { mount } from '@vue/test-utils'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { AuthService } from '@/services/auth'

// Mock AuthService
vi.mock('@/services/auth', () => ({
  AuthService: {
    getUser: vi.fn(),
    logout: vi.fn(),
    login: vi.fn()
  }
}))

describe('AppSidebar Toggle Logic', () => {
  let vuetify

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    })
    vi.clearAllMocks()
  })

  it('renders rail toggle zone on desktop (not temporary)', () => {
    const wrapper = mount({
      template: '<v-app><AppSidebar v-bind="$attrs" /></v-app>',
      components: { AppSidebar }
    }, {
      global: {
        plugins: [vuetify],
        stubs: { RouterLink: true }
      },
      props: {
        modelValue: true,
        rail: false,
        temporary: false
      }
    })
    
    expect(wrapper.find('.rail-toggle-zone').exists()).toBe(true)
  })

  it('does not render rail toggle zone on mobile (temporary)', () => {
    const wrapper = mount({
      template: '<v-app><AppSidebar v-bind="$attrs" /></v-app>',
      components: { AppSidebar }
    }, {
      global: {
        plugins: [vuetify],
        stubs: { RouterLink: true }
      },
      props: {
        modelValue: true,
        rail: false,
        temporary: true
      }
    })
    
    expect(wrapper.find('.rail-toggle-zone').exists()).toBe(false)
  })

  it('emits update:rail event when toggle is clicked', async () => {
    const wrapper = mount({
      template: '<v-app><AppSidebar ref="sidebar" v-bind="$attrs" @update:rail="onUpdateRail" /></v-app>',
      components: { AppSidebar },
      methods: {
        onUpdateRail(val) {
          this.$emit('update:rail', val)
        }
      }
    }, {
      global: {
        plugins: [vuetify],
        stubs: { RouterLink: true }
      },
      props: {
        modelValue: true,
        rail: false,
        temporary: false
      }
    })
    
    const sidebar = wrapper.findComponent(AppSidebar)
    await sidebar.find('.rail-toggle-zone').trigger('click')
    
    expect(sidebar.emitted('update:rail')).toBeTruthy()
    expect(sidebar.emitted('update:rail')[0]).toEqual([true]) 
  })
})
