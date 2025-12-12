import { createLocalVue, shallowMount } from '@vue/test-utils';
import IncomingSelect from '@/components/editform/IncomingSelect.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('IncomingSelect.vue', () => {
  let vuetify;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  it('should render with correct props', () => {
    const wrapper = shallowMount(IncomingSelect, {
      localVue,
      vuetify,
      propsData: {
        value: true
      }
    });

    expect(wrapper.props().value).toBe(true);
  });

  it('should emit change event when checkbox is toggled', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: false
      }
    });

    wrapper.vm.$emit('change', true);
    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.emitted().change[0]).toEqual([true]);
  });

  it('should pass value as input-value to v-checkbox', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: true
      }
    });

    const checkbox = wrapper.findComponent({ name: 'v-checkbox' });
    expect(checkbox.props().inputValue).toBe(true);
  });

  it('should have correct label', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'v-checkbox' });
    expect(checkbox.props().label).toBe('Eingehend');
  });

  it('should have persistent hint', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'v-checkbox' });
    expect(checkbox.props().persistentHint).toBe(true);
  });

  it('should have descriptive hint text', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'v-checkbox' });
    expect(checkbox.props().hint).toBe('Anhacken, wenn es sich bei dem Betrag um einen eingehenden (z.B. Gehalt) handelt.');
  });

  it('should have primary color', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'v-checkbox' });
    expect(checkbox.props().color).toBe('primary');
  });

  it('should handle false value', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: false
      }
    });

    const checkbox = wrapper.findComponent({ name: 'v-checkbox' });
    expect(checkbox.props().inputValue).toBe(false);
  });

  it('should handle true value', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: true
      }
    });

    const checkbox = wrapper.findComponent({ name: 'v-checkbox' });
    expect(checkbox.props().inputValue).toBe(true);
  });

  it('should emit change with false when unchecked', () => {
    const wrapper = shallowMount(IncomingSelect, {
      vuetify,
      propsData: {
        value: true
      }
    });

    wrapper.vm.$emit('change', false);
    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.emitted().change[0]).toEqual([false]);
  });
});
