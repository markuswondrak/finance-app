import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import WealthForecastTable from '@/components/wealth/WealthForecastTable.vue';

const vuetify = createVuetify({
  components,
  directives,
});

describe('WealthForecastTable.vue', () => {
  it('renders skeleton when loading', () => {
    const wrapper = mount(WealthForecastTable, {
      global: { plugins: [vuetify] },
      props: { loading: true }
    });
    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);
  });

  it('renders no data message when empty', () => {
    const wrapper = mount(WealthForecastTable, {
      global: { plugins: [vuetify] },
      props: { loading: false, forecast: { points: [] } }
    });
    expect(wrapper.text()).toContain('No data available');
  });

  it('renders table rows when data provided', () => {
    const forecast = {
      points: [
        { year: 2025, invested: 1000, worst: 900, average: 1100, best: 1200 }
      ]
    };
    const wrapper = mount(WealthForecastTable, {
      global: { plugins: [vuetify] },
      props: { loading: false, forecast }
    });
    expect(wrapper.find('tbody tr').exists()).toBe(true);
    expect(wrapper.text()).toContain('2025');
    // Check formatting - depends on locale environment, assuming de-DE
    // If test environment doesn't have de-DE, this might fail on formatting.
    // 'toCurrency' uses Intl.NumberFormat('de-DE'...). Node environment usually has it.
    expect(wrapper.text()).toContain('1.000,00'); 
  });
  
  it('emits hover event', async () => {
     const forecast = {
      points: [
        { year: 2025, invested: 1000, worst: 900, average: 1100, best: 1200 }
      ]
    };
    const wrapper = mount(WealthForecastTable, {
      global: { plugins: [vuetify] },
      props: { loading: false, forecast }
    });
    
    await wrapper.find('tbody tr').trigger('mouseenter');
    expect(wrapper.emitted('row-hover')).toBeTruthy();
    expect(wrapper.emitted('row-hover')[0]).toEqual([2025]);
  });
});