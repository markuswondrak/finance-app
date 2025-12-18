import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
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

  it('should emit update:modelValue event when toggle is changed', async () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const toggle = wrapper.findComponent({ name: 'VBtnToggle' });
    toggle.vm.$emit('update:modelValue', true);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true]);
  });

  it('should pass modelValue to v-btn-toggle', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: true
      }
    });

    const toggle = wrapper.findComponent({ name: 'VBtnToggle' });
    expect(toggle.props().modelValue).toBe(true);
  });

  it('should have correct styling props', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const toggle = wrapper.findComponent({ name: 'VBtnToggle' });
    expect(toggle.props().color).toBe('primary');
    expect(toggle.props().variant).toBe('outlined');
    expect(toggle.props().density).toBe('comfortable');
    expect(toggle.props().mandatory).toBe(true);
  });

  it('should have two buttons with correct labels', () => {
    const wrapper = mount(IncomingSelect, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: false
      }
    });

    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    expect(buttons.length).toBe(2);
    expect(buttons[0].text()).toContain('Ausgabe');
    expect(buttons[1].text()).toContain('Einnahme');
  });
});
