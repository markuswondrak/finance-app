import { mount, flushPromises } from '@vue/test-utils'
import Layout from '@/Layout.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { nextTick, ref } from 'vue'

// Mock useDisplay
const mobile = ref(false)
vi.mock('vuetify', async () => {
  const actual = await vi.importActual('vuetify')
  return {
    ...actual,
    useDisplay: () => ({ mobile })
  }
})

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({ meta: {} }),
  useRouter: () => ({ replace: vi.fn() }),
  RouterView: { template: '<div>RouterView</div>' }
}))

// Mock AuthService
vi.mock('@/services/auth', () => ({
  AuthService: {
    getUser: vi.fn().mockResolvedValue(null)
  }
}))

// Mock AppSidebar to avoid complex dependencies
const AppSidebarStub = {
  name: 'AppSidebar',
  props: ['modelValue', 'rail', 'temporary'],
  emits: ['update:modelValue', 'update:rail'],
  template: '<div class="app-sidebar-stub"></div>'
}

describe('Layout.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = createVuetify({ components, directives })
    mobile.value = false
  })

  it('renders app bar on mobile', async () => {
    mobile.value = true
    const wrapper = mount(Layout, {
      global: {
        plugins: [vuetify],
        stubs: {
          AppSidebar: AppSidebarStub,
          RouterView: true
        }
      }
    })

    // Wait for async auth check to complete
    await flushPromises()
    await nextTick()

    // Check if app bar exists
    const appBar = wrapper.findComponent(components.VAppBar)
    expect(appBar.exists()).toBe(true)

    // Check if nav icon exists
    const navIcon = wrapper.findComponent(components.VAppBarNavIcon)
    expect(navIcon.exists()).toBe(true)
  })

  it('toggles drawer when nav icon is clicked on mobile', async () => {
    mobile.value = true
    const wrapper = mount(Layout, {
      global: {
        plugins: [vuetify],
        stubs: {
          AppSidebar: AppSidebarStub,
          RouterView: true
        }
      }
    })

    // Wait for async auth check to complete
    await flushPromises()
    await nextTick()

    // Initial state: drawer should be false on mobile
    let sidebar = wrapper.findComponent(AppSidebarStub)
    expect(sidebar.props('modelValue')).toBe(false)

    // Click nav icon
    const navIcon = wrapper.findComponent(components.VAppBarNavIcon)
    await navIcon.trigger('click')

    // Drawer should be true
    expect(sidebar.props('modelValue')).toBe(true)
  })
})
