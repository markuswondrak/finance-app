import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import NameTextField from '@/components/editform/NameTextField.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('NameTextField.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
  });

  it('should render with correct props', () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: 'Test Name'
      }
    });

    expect(wrapper.props().modelValue).toBe('Test Name');
  });

  it('should emit update:modelValue event on input', async () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: ''
      }
    });

    const textField = wrapper.findComponent({ name: 'VTextField' });
    textField.vm.$emit('update:modelValue', 'New Value');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['New Value']);
  });

  it('should have name validation rules', () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: ''
      }
    });

    const rules = wrapper.vm.nameRules;
    expect(rules).toHaveLength(2);
  });

  it('should validate empty name', () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: ''
      }
    });

    const emptyRule = wrapper.vm.nameRules[0];
    expect(emptyRule('')).toBe('Bezeichnung darf nicht leer sein');
    expect(emptyRule('Valid')).toBe(true);
  });

  it('should validate name length', () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: ''
      }
    });

    const lengthRule = wrapper.vm.nameRules[1];
    expect(lengthRule('Short')).toBe(true);
    expect(lengthRule('Exactly20Characters!')).toBe(true);
    expect(lengthRule('ThisIsDefinitelyMoreThan20Characters')).toBe('Bezeichnung muss weniger als 20 Zeichen haben');
  });

  it('should have counter set to 20', () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: 'Test'
      }
    });

    const textField = wrapper.findComponent({ name: 'VTextField' });
    expect(textField.props().counter).toBe(20);
  });

  it('should have correct label', () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: ''
      }
    });

    const textField = wrapper.findComponent({ name: 'VTextField' });
    expect(textField.props().label).toBe('Bezeichnung');
  });

  it('should be required', () => {
    const wrapper = mount(NameTextField, {
      global: { plugins: [vuetify] },
      props: {
        modelValue: ''
      }
    });

    // In Vuetify 3, the VTextField is configured with validation rules that
    // enforce the required behavior. Check that the component has validation rules.
    expect(wrapper.vm.nameRules).toHaveLength(2);
    // The first rule validates that the field is not empty
    expect(wrapper.vm.nameRules[0]('')).toBe('Bezeichnung darf nicht leer sein');
  });
});