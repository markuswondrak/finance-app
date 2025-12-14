import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Layout from '@/Layout.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VApp } from 'vuetify/components'; // Import VApp

// Mock ResizeObserver - This is now handled globally in frontend/tests/setup.js
// So we don't need it here.

describe('Layout.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
  });

  // Helper to mount Layout within VApp to ensure Vuetify's layout context is available
  const mountLayout = (options = {}) => mount(VApp, {
    global: {
      plugins: [vuetify],
      stubs: { 'router-view': true, 'router-link': true, ...options.stubs },
    },
    slots: {
      default: Layout,
    },
    ...options, // Allow test-specific options to override
  });

  it('should render v-app container', () => {
    const wrapper = mountLayout();
    const app = wrapper.findComponent(VApp);
    expect(app.exists()).toBe(true);
    // Also check that Layout component is rendered inside VApp
    expect(wrapper.findComponent(Layout).exists()).toBe(true);
  });

  it('should initialize drawer to null', () => {
    const wrapper = mountLayout();
    // Access the Layout component instance via wrapper.findComponent
    expect(wrapper.findComponent(Layout).vm.drawer).toBeNull();
  });

  it('should render navigation drawer', () => {
    const wrapper = mountLayout();
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' });
    expect(drawer.exists()).toBe(true);
  });

  it('should render app bar', () => {
    const wrapper = mountLayout();
    const appBar = wrapper.findComponent({ name: 'VAppBar' });
    expect(appBar.exists()).toBe(true);
  });

  it('should display app title in toolbar', () => {
    const wrapper = mountLayout();
    const title = wrapper.findComponent({ name: 'VAppBarTitle' });
    expect(title.text()).toBe('');
  });

  it('should toggle drawer when nav icon is clicked', async () => {
    const wrapper = mountLayout();
    const navIcon = wrapper.findComponent({ name: 'VAppBarNavIcon' });
    expect(navIcon.exists()).toBe(true);
    
    await navIcon.trigger('click');
    
    // The drawer state is on the Layout component's vm
    expect(wrapper.findComponent(Layout).vm.drawer).toBeTruthy();
  });

  it('should have navigation links', () => {
    const wrapper = mountLayout();
    const listItems = wrapper.findAllComponents({ name: 'VListItem' });
    expect(listItems.length).toBeGreaterThan(0);
  });

  it('should have correct icons for navigation items', () => {
    const wrapper = mountLayout();
    const icons = wrapper.findAllComponents({ name: 'VIcon' });

    // In Vuetify 3, icons are often passed as props, not text content
    const iconProps = icons.map(icon => icon.props().icon);

    expect(iconProps).toContain('fa-chart-line');
    expect(iconProps).toContain('fa-money-check-dollar');
    expect(iconProps).toContain('fa-money-bill-wave');
<<<<<<< HEAD
=======
    expect(iconProps).toContain('fa-gear');
>>>>>>> 001-fintech-dark-theme
  });

  it('should render footer', () => {
    const wrapper = mountLayout();
    const footer = wrapper.findComponent({ name: 'VFooter' });
    expect(footer.exists()).toBe(true);
  });

  it('should display copyright in footer', () => {
    const wrapper = mountLayout();
    const footer = wrapper.findComponent({ name: 'VFooter' });
    expect(footer.text()).toContain('© 2019');
    expect(footer.text()).toContain('wondee.info');
  });

  it('should have content area with slot', () => {
    const wrapper = mountLayout();

    // Verify the Layout component contains a v-main element
    const layoutHtml = wrapper.findComponent(Layout).html();
    expect(layoutHtml).toContain('v-main');
    // Layout accepts a default slot and renders it inside v-main
    expect(wrapper.findComponent(Layout).exists()).toBe(true);
  });
<<<<<<< HEAD
=======

  it('should use dark theme from vuetify configuration', async () => {
    // Create vuetify with dark theme configured (matching the real app config)
    const darkVuetify = createVuetify({
      components,
      directives,
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: { dark: true }
        }
      }
    });

    const wrapper = mount(VApp, {
      global: {
        plugins: [darkVuetify],
        stubs: { 'router-view': true, 'router-link': true },
      },
      slots: {
        default: Layout,
      },
    });

    // The theme should be dark as configured
    expect(darkVuetify.theme.global.name.value).toBe('dark');
  });
>>>>>>> 001-fintech-dark-theme
});