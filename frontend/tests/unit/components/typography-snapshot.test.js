import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import CurrentAmount from '@/components/overview/CurrentAmount.vue';
import OverviewDetails from '@/components/overview/OverviewDetails.vue';
import { describe, it, expect } from 'vitest';

const vuetify = createVuetify({
  components,
  directives,
});

describe('User Story 3: Typography Hierarchy Snapshots', () => {
  it('CurrentAmount match snapshot', () => {
    const wrapper = mount(CurrentAmount, {
      global: { plugins: [vuetify] },
      props: { currentAmount: 1234.56 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('OverviewDetails match snapshot', () => {
     const wrapper = mount(OverviewDetails, {
      global: {
        plugins: [vuetify],
        stubs: {
           DeleteButton: true,
           SpecialCostForm: true
        }
      },
      props: {
        detail: { yearMonth: '2025-01', index: 0 },
      },
      data() {
        return {
          show: true,
          fixedCosts: [{ name: 'Rent', amount: -500, displayType: 'Monthly' }],
          specialCosts: [],
          loaded: true
        }
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
