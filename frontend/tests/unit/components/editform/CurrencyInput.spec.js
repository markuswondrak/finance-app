import { shallowMount } from '@vue/test-utils';
import CurrencyInput from '@/components/editform/CurrencyInput.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { toCurrency } from '@/components/Utils';

Vue.use(Vuetify);

describe('CurrencyInput.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should render with correct props', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    expect(wrapper.props().id).toBe('amount-input');
    expect(wrapper.props().label).toBe('Betrag');
    expect(wrapper.props().value).toBe(1000);
  });

  it('should display formatted currency when not focused', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1500
      }
    });

    expect(wrapper.vm.focus).toBe(false);
    expect(wrapper.vm.displayValue).toBe(toCurrency(1500));
    expect(wrapper.vm.displayValue).toBe('1.500 €');
  });

  it('should display raw value when focused', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1500
      }
    });

    wrapper.setData({ focus: true });
    expect(wrapper.vm.displayValue).toBe(1500);
  });

  it('should set focus to true on focus event', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    const textField = wrapper.findComponent({ name: 'v-text-field' });
    textField.vm.$emit('focus');

    expect(wrapper.vm.focus).toBe(true);
  });

  it('should emit input event with numeric value on blur', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    wrapper.vm.inputChanged({ target: { value: '2500' } });

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual([2500]);
    expect(wrapper.vm.focus).toBe(false);
  });

  it('should emit 0 when input is not a valid number', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    wrapper.vm.inputChanged({ target: { value: 'invalid' } });

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual([0]);
  });

  it('should handle decimal numbers', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    wrapper.vm.inputChanged({ target: { value: '1500.75' } });

    expect(wrapper.emitted().input[0]).toEqual([1500.75]);
  });

  it('should handle negative numbers', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    wrapper.vm.inputChanged({ target: { value: '-500' } });

    expect(wrapper.emitted().input[0]).toEqual([-500]);
  });

  it('should have validation rules', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    const rules = wrapper.vm.valueRules;
    expect(rules).toHaveLength(1);
  });

  it('should validate positive non-zero values', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000
      }
    });

    const rule = wrapper.vm.valueRules[0];
    expect(rule('100')).toBe(true);
    expect(rule('0')).toBe('Betrag muss positiv und ungleich 0 sein');
    expect(rule('-50')).toBe('Betrag muss positiv und ungleich 0 sein');
  });

  it('should be required', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 1000,
        required: true
      }
    });

    const textField = wrapper.findComponent({ name: 'v-text-field' });
    // Check if required attribute is present in the HTML
    expect(textField.html()).toContain('required');
  });

  it('should pass label prop to v-text-field', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Custom Label',
        value: 1000
      }
    });

    const textField = wrapper.findComponent({ name: 'v-text-field' });
    expect(textField.props().label).toBe('Custom Label');
  });

  it('should handle zero value display', () => {
    const wrapper = shallowMount(CurrencyInput, {
      vuetify,
      propsData: {
        id: 'amount-input',
        label: 'Betrag',
        value: 0
      }
    });

    expect(wrapper.vm.displayValue).toBe(toCurrency(0));
    expect(wrapper.vm.displayValue).toBe('0 €');
  });
});
