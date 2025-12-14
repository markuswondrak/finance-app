import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import CurrentAmount from '@/components/overview/CurrentAmount.vue';
import { describe, it, expect } from 'vitest';

const vuetify = createVuetify({
  components,
  directives,
});

describe('User Story 3: Typography Hierarchy', () => {
  it('CurrentAmount.vue applies correct typography classes to financial figure', () => {
    const wrapper = mount(CurrentAmount, {
      global: {
        plugins: [vuetify],
      },
      props: {
        currentAmount: 1234.56,
      },
    });

    const amount = wrapper.find('strong');
    expect(amount.classes()).toContain('text-h4');
    expect(amount.classes()).toContain('font-weight-bold');
  });

  it('CurrentAmount.vue applies correct typography classes to label', () => {
    const wrapper = mount(CurrentAmount, {
      global: {
        plugins: [vuetify],
      },
      props: {
        currentAmount: 1234.56,
      },
    });

    // Expecting the label "Aktueller Betrag:" to be wrapped in a span with these classes
    // This implies a change in structure will be made
    const label = wrapper.find('.text-body-2.text-medium-emphasis');
    expect(label.exists()).toBe(true);
    expect(label.text()).toContain('Aktueller Betrag:');
  });
});
