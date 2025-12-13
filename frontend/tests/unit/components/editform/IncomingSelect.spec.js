import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import IncomingSelect from '@/components/editform/IncomingSelect.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('IncomingSelect.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
  });

  it('should render with correct props', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: true
      }
    });

    expect(wrapper.props().modelValue).toBe(true);
  });

  it('should emit update:modelValue event when checkbox is toggled', async () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    checkbox.vm.$emit('update:modelValue', true);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true]);
  });

  it('should pass modelValue as model-value to v-checkbox', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: true
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    expect(checkbox.props().modelValue).toBe(true);
  });

  it('should have correct label', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    expect(checkbox.props().label).toBe('Eingehend');
  });

  it('should have persistent hint', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    expect(checkbox.props().persistentHint).toBe(true);
  });

  it('should have descriptive hint text', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    expect(checkbox.props().hint).toBe('Anhacken, wenn es sich bei dem Betrag um einen eingehenden (z.B. Gehalt) handelt.');
  });

  it('should have primary color', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    expect(checkbox.props().color).toBe('primary');
  });

  it('should handle false value', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    expect(checkbox.props().modelValue).toBe(false);
  });

  it('should handle true value', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: true
      }
    });

    const checkbox = wrapper.findComponent({ name: 'VCheckbox' });
    expect(checkbox.props().modelValue).toBe(true);
  });
});