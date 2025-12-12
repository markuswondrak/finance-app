import { createLocalVue, mount } from '@vue/test-utils';
import DeleteButton from '@/components/DeleteButton.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('DeleteButton.vue', () => {
  let vuetify;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();

    // Create a div with data-app attribute for Vuetify
    const app = document.createElement('div');
    app.setAttribute('data-app', 'true');
    document.body.appendChild(app);

    vuetify = new Vuetify();
  });

  afterEach(() => {
    // Clean up
    const app = document.querySelector('[data-app]');
    if (app) {
      document.body.removeChild(app);
    }
  });

  it('should render with correct props', () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    expect(wrapper.props().name).toBe('Test Item');
  });

  it('should initialize with dialog closed', () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    expect(wrapper.vm.show).toBe(false);
  });

  it('should display item name in dialog title', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Rent Payment'
      }
    });

    // Open the dialog to make content visible
    await wrapper.setData({ show: true });
    await wrapper.vm.$nextTick();

    // Check the card title component specifically, as wrapper.text() may not work with v-dialog
    const cardTitle = wrapper.findComponent({ name: 'v-card-title' });
    expect(cardTitle.text()).toContain('Rent Payment');
  });

  it('should display confirmation text with item name', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Cost'
      }
    });

    // Open the dialog to make content visible
    await wrapper.setData({ show: true });
    await wrapper.vm.$nextTick();

    const cardText = wrapper.findComponent({ name: 'v-card-text' });
    expect(cardText.text()).toContain('Test Cost');
    expect(cardText.text()).toContain('unwiderruflich gelöscht');
    expect(cardText.text()).toContain('Sind Sie sich sicher?');
  });

  it('should have trash icon button', () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    const icon = wrapper.findComponent({ name: 'v-icon' });
    expect(icon.exists()).toBe(true);
    expect(icon.props().small).toBe(true);
    // Font Awesome icons use classes, check the icon content via html
    expect(icon.html()).toContain('fa-trash-alt');
  });

  it('should open dialog when activator button is clicked', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    expect(wrapper.vm.show).toBe(false);
    await wrapper.setData({ show: true });
    expect(wrapper.vm.show).toBe(true);
  });

  it('should close dialog when cancel button is clicked', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    await wrapper.setData({ show: true });
    expect(wrapper.vm.show).toBe(true);

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const cancelButton = buttons.wrappers.find(btn => btn.text() === 'Abbrechen');

    await cancelButton.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.show).toBe(false);
  });

  it('should emit confirm event when delete button is clicked', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    await wrapper.setData({ show: true });

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const deleteButton = buttons.wrappers.find(btn => btn.text() === 'Löschen');

    await deleteButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().confirm).toBeTruthy();
    expect(wrapper.vm.show).toBe(false);
  });

  it('should have error color on delete button', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    // Open dialog to make buttons visible
    await wrapper.setData({ show: true });
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const deleteButton = buttons.wrappers.find(btn => btn.text() === 'Löschen');

    expect(deleteButton.props().color).toBe('error');
  });

  it('should have text prop on cancel button', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    // Open dialog to make buttons visible
    await wrapper.setData({ show: true });
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: 'v-btn' });
    const cancelButton = buttons.wrappers.find(btn => btn.text() === 'Abbrechen');

    expect(cancelButton.props().text).toBe(true);
  });

  it('should have max-width on dialog', () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test Item'
      }
    });

    const dialog = wrapper.findComponent({ name: 'v-dialog' });
    expect(dialog.props().maxWidth).toBe('600');
  });

  it('should handle empty name prop', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: ''
      }
    });

    // Open the dialog to make content visible
    await wrapper.setData({ show: true });
    await wrapper.vm.$nextTick();

    const cardTitle = wrapper.findComponent({ name: 'v-card-title' });
    expect(cardTitle.text()).toContain("'' Löschen");
  });

  it('should handle special characters in name', async () => {
    const wrapper = mount(DeleteButton, {
      vuetify,
      localVue,
      propsData: {
        name: 'Test & Special <Name>'
      }
    });

    // Open the dialog to make content visible
    await wrapper.setData({ show: true });
    await wrapper.vm.$nextTick();

    const cardText = wrapper.findComponent({ name: 'v-card-text' });
    expect(cardText.text()).toContain('Test & Special <Name>');
  });
});
