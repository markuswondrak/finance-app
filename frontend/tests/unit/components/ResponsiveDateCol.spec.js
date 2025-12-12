import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import ResponsiveDateCol from '@/components/ResponsiveDateCol.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.filter('displayLongMonth', (value) => {
  if (!value) return '';
  return `${value}`;
});

Vue.use(Vuetify);

describe('ResponsiveDateCol.vue', () => {
  let vuetify;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  it('should render with correct props', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      localVue,
      vuetify,
      propsData: {
        entry: {
          name: 'Test Entry',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    expect(wrapper.props().entry.name).toBe('Test Entry');
  });

  it('should be visible when entry has from date', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: null
        }
      }
    });

    expect(wrapper.vm.visible).toBe(true);
  });

  it('should be visible when entry has to date', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: null,
          to: '2023-12'
        }
      }
    });

    expect(wrapper.vm.visible).toBe(true);
  });

  it('should be visible when entry has both from and to dates', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    expect(wrapper.vm.visible).toBe(true);
  });

  it('should not be visible when entry has neither from nor to date', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: null,
          to: null
        }
      }
    });

    expect(wrapper.vm.visible).toBe(false);
  });

  it('should initialize with dialog closed', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    expect(wrapper.vm.dialog).toBe(false);
  });

  it('should render calendar icon when visible', () => {
    // Use mount() instead of shallowMount() to properly render dialog slot content
    const wrapper = mount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: null
        }
      }
    });

    const icon = wrapper.findComponent({ name: 'v-icon' });
    expect(icon.exists()).toBe(true);
    // Font Awesome icons use classes, check via HTML content
    expect(icon.html()).toContain('fa-calendar-alt');
    expect(icon.props().small).toBe(true);
  });

  it('should not render dialog when not visible', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: null,
          to: null
        }
      }
    });

    const dialog = wrapper.findComponent({ name: 'v-dialog' });
    expect(dialog.exists()).toBe(false);
  });

  it('should display entry name in dialog title', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Monthly Rent',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    const cardTitle = wrapper.findComponent({ name: 'v-card-title' });
    expect(cardTitle.text()).toBe('Monthly Rent');
  });

  it('should display from date when present', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: null
        }
      }
    });

    const cardText = wrapper.findComponent({ name: 'v-card-text' });
    expect(cardText.text()).toContain('Ab');
    expect(cardText.text()).toContain('2023-01');
  });

  it('should display to date when present', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: null,
          to: '2023-12'
        }
      }
    });

    const cardText = wrapper.findComponent({ name: 'v-card-text' });
    expect(cardText.text()).toContain('Bis');
    expect(cardText.text()).toContain('2023-12');
  });

  it('should display both from and to dates when both present', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    const cardText = wrapper.findComponent({ name: 'v-card-text' });
    expect(cardText.text()).toContain('Ab');
    expect(cardText.text()).toContain('2023-01');
    expect(cardText.text()).toContain('Bis');
    expect(cardText.text()).toContain('2023-12');
  });

  it('should have correct dialog width', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    const dialog = wrapper.findComponent({ name: 'v-dialog' });
    expect(dialog.props().width).toBe('500');
  });

  it('should render as td element with right alignment', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: 'Test',
          from: '2023-01',
          to: null
        }
      }
    });

    expect(wrapper.element.tagName).toBe('TD');
    expect(wrapper.attributes().align).toBe('right');
  });

  it('should handle entry with empty name', () => {
    const wrapper = shallowMount(ResponsiveDateCol, {
      vuetify,
      localVue,
      propsData: {
        entry: {
          name: '',
          from: '2023-01',
          to: '2023-12'
        }
      }
    });

    const cardTitle = wrapper.findComponent({ name: 'v-card-title' });
    expect(cardTitle.text()).toBe('');
  });
});
