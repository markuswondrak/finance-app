import { shallowMount } from '@vue/test-utils';
import NameTextField from '@/components/editform/NameTextField.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('NameTextField.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should render with correct props', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: 'Test Name'
      }
    });

    expect(wrapper.props().value).toBe('Test Name');
  });

  it('should emit input event on change', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: ''
      }
    });

    wrapper.vm.$emit('input', 'New Value');
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual(['New Value']);
  });

  it('should have name validation rules', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: ''
      }
    });

    const rules = wrapper.vm.nameRules;
    expect(rules).toHaveLength(2);
  });

  it('should validate empty name', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: ''
      }
    });

    const emptyRule = wrapper.vm.nameRules[0];
    expect(emptyRule('')).toBe('Bezeichnung darf nicht leer sein');
    expect(emptyRule('Valid')).toBe(true);
  });

  it('should validate name length', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: ''
      }
    });

    const lengthRule = wrapper.vm.nameRules[1];
    expect(lengthRule('Short')).toBe(true);
    expect(lengthRule('Exactly20Characters!')).toBe(true);
    expect(lengthRule('ThisIsDefinitelyMoreThan20Characters')).toBe('Bezeichnung muss weniger als 20 Zeichen haben');
  });

  it('should have counter set to 20', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: 'Test'
      }
    });

    const textField = wrapper.findComponent({ name: 'v-text-field' });
    expect(textField.props().counter).toBe(20);
  });

  it('should have correct label', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: ''
      }
    });

    const textField = wrapper.findComponent({ name: 'v-text-field' });
    expect(textField.props().label).toBe('Bezeichnung');
  });

  it('should be required', () => {
    const wrapper = shallowMount(NameTextField, {
      vuetify,
      propsData: {
        value: '',
        required: true
      }
    });

    const textField = wrapper.findComponent({ name: 'v-text-field' });
    // Check if required attribute is present in the HTML
    expect(textField.html()).toContain('required');
  });
});
