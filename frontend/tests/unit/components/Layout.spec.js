import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Layout from '@/Layout.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('Layout.vue', () => {
  let vuetify;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  it('should render v-app container', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const app = wrapper.findComponent({ name: 'v-app' });
    expect(app.exists()).toBe(true);
  });

  it('should initialize drawer to null', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    expect(wrapper.vm.drawer).toBeNull();
  });

  it('should render navigation drawer', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const drawer = wrapper.findComponent({ name: 'v-navigation-drawer' });
    expect(drawer.exists()).toBe(true);
    expect(drawer.props().app).toBe(true);
    expect(drawer.props().clipped).toBe(true);
  });

  it('should render app bar', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const appBar = wrapper.findComponent({ name: 'v-app-bar' });
    expect(appBar.exists()).toBe(true);
    expect(appBar.props().app).toBe(true);
    expect(appBar.props().clippedLeft).toBe(true);
  });

  it('should display app title in toolbar', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const toolbarTitle = wrapper.findComponent({ name: 'v-toolbar-title' });
    expect(toolbarTitle.text()).toBe('Finanz-App');
  });

  it('should toggle drawer when nav icon is clicked', async () => {
    const wrapper = mount(Layout, {
      vuetify,
      localVue,
      stubs: {
        'router-link': true
      },
      attachTo: document.body
    });

    expect(wrapper.vm.drawer).toBeNull();

    const navIcon = wrapper.find('button.v-app-bar__nav-icon');
    await navIcon.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.drawer).toBe(true);
    wrapper.destroy();
  });

  it('should have navigation links', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' });
    expect(listItems.length).toBeGreaterThan(0);
  });

  it('should have Überblick navigation link to /', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' });
    const overviewLink = listItems.wrappers.find(item =>
      item.props().to === '/'
    );

    expect(overviewLink).toBeDefined();
    expect(overviewLink.text()).toContain('Überblick');
  });

  it('should have Fixkosten navigation link to /fixedcosts', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' });
    const fixedCostsLink = listItems.wrappers.find(item =>
      item.props().to === '/fixedcosts'
    );

    expect(fixedCostsLink).toBeDefined();
    expect(fixedCostsLink.text()).toContain('Fixkosten');
  });

  it('should have Sonderkosten navigation link to /specialcosts', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' });
    const specialCostsLink = listItems.wrappers.find(item =>
      item.props().to === '/specialcosts'
    );

    expect(specialCostsLink).toBeDefined();
    expect(specialCostsLink.text()).toContain('Sonderkosten');
  });

  it('should have Sonstiges menu group', () => {
    const wrapper = mount(Layout, {
      vuetify,
      localVue,
      stubs: {
        'router-link': true
      }
    });

    const listGroup = wrapper.findComponent({ name: 'v-list-group' });
    expect(listGroup.exists()).toBe(true);
    expect(listGroup.text()).toContain('Sonstiges');
  });

  it('should have Einstellungen in Sonstiges group', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    expect(wrapper.text()).toContain('Einstellungen');
  });

  it('should have Impressum in Sonstiges group', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    expect(wrapper.text()).toContain('Impressum');
  });

  it('should have Datenschutzerklärung in Sonstiges group', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    expect(wrapper.text()).toContain('Datenschutzerklärung');
  });

  it('should have correct icons for navigation items', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const icons = wrapper.findAllComponents({ name: 'v-icon' });
    const iconTexts = icons.wrappers.map(icon => icon.text());

    expect(iconTexts).toContain('fa-chart-line');
    expect(iconTexts).toContain('fa-money-check-alt');
    expect(iconTexts).toContain('fa-money-bill-wave');
    expect(iconTexts).toContain('fa-cog');
  });

  it('should render footer', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const footer = wrapper.findComponent({ name: 'v-footer' });
    expect(footer.exists()).toBe(true);
    expect(footer.props().app).toBe(true);
  });

  it('should display copyright in footer', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const footer = wrapper.findComponent({ name: 'v-footer' });
    expect(footer.text()).toContain('© 2019');
    expect(footer.text()).toContain('wondee.info');
  });

  it('should have content area with slot', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue,
      slots: {
        default: '<div class="test-content">Test Content</div>'
      }
    });

    const content = wrapper.findComponent({ name: 'v-main' });
    expect(content.exists()).toBe(true);
    expect(wrapper.html()).toContain('test-content');
  });

  it('should enable dark theme on created', async () => {
    const mockTheme = {
      dark: false
    };

    const testVuetify = new Vuetify();

    const wrapper = shallowMount(Layout, {
      vuetify: testVuetify,
      localVue,
      computed: {
        '$vuetify'() {
          return {
            ...testVuetify.framework,
            theme: mockTheme
          };
        }
      }
    });
    await wrapper.vm.$nextTick();

    expect(mockTheme.dark).toBe(true);
  });

  it('should render dense navigation list', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const list = wrapper.findComponent({ name: 'v-list' });
    expect(list.props().dense).toBe(true);
  });

  it('should have divider in Sonstiges group', () => {
    const wrapper = shallowMount(Layout, {
      vuetify,
      localVue
    });

    const divider = wrapper.findComponent({ name: 'v-divider' });
    expect(divider.exists()).toBe(true);
  });
});
