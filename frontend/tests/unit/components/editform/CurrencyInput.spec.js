import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CurrencyInput from '@/components/editform/CurrencyInput.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { toCurrency } from '@/components/common/Utils';

describe('CurrencyInput.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
  });

  it('should render with correct props', () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    expect(wrapper.props().id).toBe('amount-input');
    expect(wrapper.props().label).toBe('Betrag');
    expect(wrapper.props().modelValue).toBe(1000);
  });

  it('should display formatted currency when not focused', () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1500
      }
    });

    expect(wrapper.vm.focus).toBe(false);
    expect(wrapper.vm.displayValue).toBe(toCurrency(1500));
  });

  it('should display raw value when focused', async () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1500
      }
    });

    await wrapper.setData({ focus: true });
    expect(wrapper.vm.displayValue).toBe(1500);
  });

  it('should set focus to true on focus event', async () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    const textField = wrapper.findComponent({ name: 'VTextField' });
    await textField.trigger('focus');

    expect(wrapper.vm.focus).toBe(true);
  });

  it('should emit update:modelValue event with numeric value on blur', async () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    await wrapper.vm.inputChanged({ target: { value: '2500' } });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([2500]);
    expect(wrapper.vm.focus).toBe(false);
  });

  it('should emit 0 when input is not a valid number', async () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    await wrapper.vm.inputChanged({ target: { value: 'invalid' } });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([0]);
  });

  it('should handle decimal numbers', async () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    await wrapper.vm.inputChanged({ target: { value: '1500.75' } });

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([1500.75]);
  });

  it('should handle negative numbers', async () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    await wrapper.vm.inputChanged({ target: { value: '-500' } });

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([-500]);
  });

  it('should have validation rules', () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    const rules = wrapper.vm.valueRules;
    expect(rules).toHaveLength(1);
  });

  it('should validate positive non-zero values', () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    const rule = wrapper.vm.valueRules[0];
    expect(rule('100')).toBe(true);
    expect(rule('0')).toBe('Betrag muss positiv und ungleich 0 sein');
    expect(rule('-50')).toBe('Betrag muss positiv und ungleich 0 sein');
  });

  it('should be required', () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 1000
      }
    });

    // In Vuetify 3, the VTextField is configured with validation rules that
    // enforce the required behavior. Check that the component has validation rules.
    expect(wrapper.vm.valueRules).toHaveLength(1);
    // The rule validates that the field is positive and non-zero
    expect(wrapper.vm.valueRules[0]('0')).toBe('Betrag muss positiv und ungleich 0 sein');
  });

  it('should pass label prop to v-text-field', () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Custom Label',
        modelValue: 1000
      }
    });

    const textField = wrapper.findComponent({ name: 'VTextField' });
    expect(textField.props().label).toBe('Custom Label');
  });

  it('should handle zero value display', () => {
    const wrapper = mount(CurrencyInput, {
      global: { plugins: [vuetify] },
      props: {
        id: 'amount-input',
        label: 'Betrag',
        modelValue: 0
      }
    });

    expect(wrapper.vm.displayValue).toBe(toCurrency(0));
  });
});