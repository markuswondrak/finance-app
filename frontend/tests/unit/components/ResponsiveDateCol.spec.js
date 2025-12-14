import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ResponsiveDateCol from '@/components/ResponsiveDateCol.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Mock displayMonth filter logic is now inside component method using imported Util.
// We can mock the Util if we want, or just rely on its output.

describe('ResponsiveDateCol.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
  });

  it('should render with correct props', () => {
    const wrapper = mount(ResponsiveDateCol, {
      global: { plugins: [vuetify] },
      props: {
        entry: {
          name: 'Test Entry',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    expect(wrapper.props().entry.name).toBe('Test Entry');
  });

  it('should be visible when entry has from date', () => {
    const wrapper = mount(ResponsiveDateCol, {
      global: { plugins: [vuetify] },
      props: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: null
        }
      }
    });

    expect(wrapper.vm.visible).toBe(true);
  });

  it('should be visible when entry has to date', () => {
    const wrapper = mount(ResponsiveDateCol, {
      global: { plugins: [vuetify] },
      props: {
        entry: {
          name: 'Test',
          from: null,
          to: '2023-12'
        }
      }
    });

    expect(wrapper.vm.visible).toBe(true);
  });

  it('should not be visible when entry has neither from nor to date', () => {
    const wrapper = mount(ResponsiveDateCol, {
      global: { plugins: [vuetify] },
      props: {
        entry: {
          name: 'Test',
          from: null,
          to: null
        }
      }
    });

    expect(wrapper.vm.visible).toBe(false);
  });

  it('should render calendar icon when visible', () => {
    const wrapper = mount(ResponsiveDateCol, {
      global: { plugins: [vuetify] },
      props: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: null
        }
      }
    });

    const icon = wrapper.findComponent({ name: 'VIcon' });
    expect(icon.exists()).toBe(true);
    // Font Awesome 6 uses fa-calendar-days instead of fa-calendar-alt
    expect(icon.classes()).toContain('fa-calendar-days');
  });

  it('should display entry name in dialog title', async () => {
    const wrapper = mount(ResponsiveDateCol, {
      global: { plugins: [vuetify] },
      props: {
        entry: {
          name: 'Monthly Rent',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    // Open dialog
    await wrapper.setData({ dialog: true });

    const cardTitle = wrapper.findComponent({ name: 'VCardTitle' });
    expect(cardTitle.text()).toBe('Monthly Rent');
  });

  it('should display from date when present', async () => {
    const wrapper = mount(ResponsiveDateCol, {
      global: { plugins: [vuetify] },
      props: {
        entry: {
          name: 'Test',
          from: { year: 2023, month: 1 }, // from is YearMonth object usually? Or string? 
          // Based on Utils.js displayMonth, it expects object {year, month}.
          // But test passed strings '2023-01'. 
          // Wait, Utils.js `displayMonth` expects object.
          // `ResponsiveDateCol.spec.js` passed '2023-01'.
          // The previous test suite mocked filter: `Vue.filter('displayLongMonth', (value) => { return ${value} });`
          // So it just returned string.
          // Now I use real function.
          // I must pass object compatible with displayMonth.
          to: null
        }
      }
    });

    await wrapper.setData({ dialog: true });
    
    // Using object because real Utils.js expects it.
    // If real app passes strings, then Utils.js handles strings? 
    // Utils.js: const { year, month } = yearMonth; -> Destructuring throws if string.
    // So real app must pass objects.
    // I should fix test data.
    
    const cardText = wrapper.findComponent({ name: 'VCardText' });
    expect(cardText.text()).toContain('Ab');
    expect(cardText.text()).toContain('Januar / 2023');
  });
});
