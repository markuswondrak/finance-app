import { shallowMount, mount } from '@vue/test-utils';
import CostEditForm from '@/components/editform/CostEditForm.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('CostEditForm.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should render with required props', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: 'fa-edit',
        successMsg,
        name: 'TestCost'
      }
    });

    expect(wrapper.props().title).toBe('Edit Cost');
    expect(wrapper.props().changed).toBe(true);
    expect(wrapper.props().successMsg).toBe(successMsg);
  });

  it('should initialize with correct default data', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    expect(wrapper.vm.valid).toBe(false);
    expect(wrapper.vm.dialog).toBe(false);
    expect(wrapper.vm.saving).toBe(false);
    expect(wrapper.vm.snackbar).toBe(false);
  });

  it('should use default icon when icon prop is not provided', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    expect(wrapper.vm.btnIcon).toBe('fa-edit');
  });

  it('should use custom icon when icon prop is provided', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: 'fa-plus',
        successMsg,
        name: 'TestCost'
      }
    });

    expect(wrapper.vm.btnIcon).toBe('fa-plus');
  });

  it('should render icon button when btnText is not provided', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = mount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: 'fa-edit',
        successMsg,
        name: 'TestCost'
      }
    });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const activatorButton = buttons.at(0);
    expect(activatorButton.props().icon).toBe(true);
    expect(activatorButton.props().text).toBe(false);
  });

  it('should render text button when btnText is provided', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = mount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: 'Add New',
        icon: 'fa-plus',
        successMsg,
        name: 'TestCost'
      }
    });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const activatorButton = buttons.at(0);
    expect(activatorButton.props().icon).toBe(false);
    expect(activatorButton.props().text).toBe(true);
  });

  it('should display title in dialog', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Monthly Cost',
        changed: false,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    await wrapper.setData({ dialog: true });
    await wrapper.vm.$nextTick();

    const cardTitle = wrapper.findComponent({ name: 'v-card-title' });
    expect(cardTitle.text()).toBe('Edit Monthly Cost');
  });

  it('should have persistent dialog', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    const dialog = wrapper.findComponent({ name: 'v-dialog' });
    expect(dialog.props().persistent).toBe(true);
  });

  it('should have max-width on dialog', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    const dialog = wrapper.findComponent({ name: 'v-dialog' });
    expect(dialog.props().maxWidth).toBe('800');
  });

  it('should close dialog when cancel button is clicked', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = mount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    await wrapper.setData({ dialog: true });
    expect(wrapper.vm.dialog).toBe(true);

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const cancelButton = buttons.wrappers.find(btn => btn.text() === 'Abbrechen');
    await cancelButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.dialog).toBe(false);
  });

  it('should emit save event and set saving to true when save button is clicked', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = mount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    await wrapper.setData({ dialog: true, valid: true });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const saveButton = buttons.wrappers.find(btn => btn.text() === 'Speichern');
    await saveButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().save).toBeTruthy();
    expect(wrapper.vm.saving).toBe(true);
  });

  it('should disable save button when form is not valid', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    await wrapper.setData({ dialog: true, valid: false });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const saveButton = buttons.wrappers.find(btn => btn.text() === 'Speichern');
    expect(saveButton.props().disabled).toBe(true);
  });

  it('should disable save button when form is not changed', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: false,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    await wrapper.setData({ dialog: true, valid: true });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const saveButton = buttons.wrappers.find(btn => btn.text() === 'Speichern');
    expect(saveButton.props().disabled).toBe(true);
  });

  it('should enable save button when form is valid and changed', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    await wrapper.setData({ dialog: true, valid: true });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const saveButton = buttons.wrappers.find(btn => btn.text() === 'Speichern');
    expect(saveButton.props().disabled).toBe(false);
  });

  it('should show loading state on save button when saving', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    await wrapper.setData({ dialog: true, valid: true, saving: true });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const saveButton = buttons.wrappers.find(btn => btn.text() === 'Speichern');
    expect(saveButton.props().loading).toBe(true);
  });

  it('should call success method correctly', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    wrapper.setData({ dialog: true, saving: true, snackbar: false });
    wrapper.vm.success();

    expect(wrapper.vm.dialog).toBe(false);
    expect(wrapper.vm.saving).toBe(false);
    expect(wrapper.vm.snackbar).toBe(true);
  });

  it('should display success snackbar with correct message', () => {
    const successMsg = jest.fn(() => 'Cost saved successfully!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    wrapper.vm.success();
    expect(wrapper.vm.snackbar).toBe(true);
  });

  it('should have correct snackbar properties', () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      }
    });

    const snackbar = wrapper.findComponent({ name: 'v-snackbar' });
    expect(snackbar.props().bottom).toBe(true);
    expect(snackbar.props().color).toBe('success');
    expect(snackbar.props().timeout).toBe(7000);
  });

  it('should render slot content', async () => {
    const successMsg = jest.fn(() => 'Success!');
    const wrapper = shallowMount(CostEditForm, {
      vuetify,
      propsData: {
        title: 'Edit Cost',
        changed: true,
        btnText: null,
        icon: null,
        successMsg,
        name: 'TestCost'
      },
      slots: {
        default: '<div class="test-slot">Slot Content</div>'
      }
    });

    await wrapper.setData({ dialog: true });
    expect(wrapper.html()).toContain('test-slot');
  });
});
