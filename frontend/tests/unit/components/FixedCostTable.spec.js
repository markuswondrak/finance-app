import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import FixedCostTable from '@/components/FixedCostTable.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('FixedCostTable.vue', () => {
  let vuetify;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  const mockEntries = [
    { id: 1, name: 'Rent', amount: 1000, from: '2023-01', to: '2023-12' },
    { id: 2, name: 'Insurance', amount: 200, from: '2023-01', to: null }
  ];

  const mockCols = [
    { name: 'name', label: 'Name' },
    { name: 'amount', label: 'Amount' }
  ];

  it('should render with required props', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    expect(wrapper.props().entries).toEqual(mockEntries);
    expect(wrapper.props().cols).toEqual(mockCols);
    expect(wrapper.props().formComponent).toBe('MonthlyCostEditForm');
  });

  it('should wrap content in v-card', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const card = wrapper.findComponent({ name: 'v-card' });
    expect(card.exists()).toBe(true);
  });

  it('should render CostTable component', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const costTable = wrapper.findComponent({ name: 'CostTable' });
    expect(costTable.exists()).toBe(true);
  });

  it('should pass entries and cols to CostTable', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const costTable = wrapper.findComponent({ name: 'CostTable' });
    expect(costTable.props().entries).toEqual(mockEntries);
    expect(costTable.props().cols).toEqual(mockCols);
  });

  it('should render responsive date column on mobile', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify: new Vuetify(),
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      },
      computed: {
        '$vuetify'() {
          return {
            breakpoint: {
              smAndDown: true
            }
          };
        }
      }
    });

    const responsiveDateCol = wrapper.findComponent({ name: 'ResponsiveDateCol' });
    expect(responsiveDateCol.exists()).toBe(true);
  });

  it('should not render responsive date column on desktop', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      },
      mocks: {
        $vuetify: {
          breakpoint: {
            smAndDown: false
          }
        }
      }
    });

    expect(wrapper.html()).not.toContain('responsive-date-col');
  });

  it('should render add new costs button in card actions', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const cardActions = wrapper.findComponent({ name: 'v-card-actions' });
    expect(cardActions.exists()).toBe(true);
  });

  it('should use dynamic form component', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const formComponents = wrapper.findAllComponents({ name: 'MonthlyCostEditForm' });
    expect(formComponents.length).toBeGreaterThan(0);
  });

  it('should render form component for adding new costs', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const cardActions = wrapper.findComponent({ name: 'v-card-actions' });
    expect(cardActions.html()).toContain('Neue Kosten Hinzufügen');
  });

  it('should handle quarterly form component', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'QuaterlyCostEditForm'
      }
    });

    const formComponents = wrapper.findAllComponents({ name: 'QuaterlyCostEditForm' });
    expect(formComponents.length).toBeGreaterThan(0);
  });

  it('should handle half-yearly form component', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'HalfyearlyCostEditForm'
      }
    });

    const formComponents = wrapper.findAllComponents({ name: 'HalfyearlyCostEditForm' });
    expect(formComponents.length).toBeGreaterThan(0);
  });

  it('should handle yearly form component', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'YearlyCostEditForm'
      }
    });

    const formComponents = wrapper.findAllComponents({ name: 'YearlyCostEditForm' });
    expect(formComponents.length).toBeGreaterThan(0);
  });

  it('should have all required form components registered', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const components = wrapper.vm.$options.components;
    expect(components).toHaveProperty('MonthlyCostEditForm');
    expect(components).toHaveProperty('QuaterlyCostEditForm');
    expect(components).toHaveProperty('HalfyearlyCostEditForm');
    expect(components).toHaveProperty('YearlyCostEditForm');
    expect(components).toHaveProperty('CostTable');
    expect(components).toHaveProperty('ResponsiveDateCol');
  });

  it('should handle empty entries', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: [],
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const costTable = wrapper.findComponent({ name: 'CostTable' });
    expect(costTable.props().entries).toEqual([]);
  });

  it('should handle null entries', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: null,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const costTable = wrapper.findComponent({ name: 'CostTable' });
    expect(costTable.props().entries).toBeNull();
  });

  it('should render in v-card-text', () => {
    const wrapper = shallowMount(FixedCostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const cardText = wrapper.findComponent({ name: 'v-card-text' });
    expect(cardText.exists()).toBe(true);
    const costTable = cardText.findComponent({ name: 'CostTable' });
    expect(costTable.exists()).toBe(true);
  });
});
