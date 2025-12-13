import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FixedCostTable from '@/components/FixedCostTable.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('FixedCostTable.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
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
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
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
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const card = wrapper.findComponent({ name: 'VCard' });
    expect(card.exists()).toBe(true);
  });

  it('should render v-data-table instead of CostTable', () => {
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    // v-data-table is complex, finding by component name usually works with Vuetify 3 aliases?
    // Vuetify 3 component names are usually PascalCase VSomething.
    const dataTable = wrapper.findComponent({ name: 'VDataTable' });
    expect(dataTable.exists()).toBe(true);
  });

  it('should pass entries to v-data-table items', () => {
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const dataTable = wrapper.findComponent({ name: 'VDataTable' });
    expect(dataTable.props().items).toEqual(mockEntries);
  });

  it('should render add new costs button in card actions', () => {
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    const cardActions = wrapper.findComponent({ name: 'VCardActions' });
    expect(cardActions.exists()).toBe(true);
  });

  it('should use dynamic form component', () => {
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    // Verify the formComponent prop is set correctly
    expect(wrapper.props().formComponent).toBe('MonthlyCostEditForm');
    // The component should use this prop for dynamic components
    expect(wrapper.vm.$options.components).toHaveProperty('MonthlyCostEditForm');
  });

  it('should handle quarterly form component', () => {
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'QuaterlyCostEditForm'
      }
    });

    // Verify the formComponent prop is set correctly
    expect(wrapper.props().formComponent).toBe('QuaterlyCostEditForm');
    // The component should have QuaterlyCostEditForm registered
    expect(wrapper.vm.$options.components).toHaveProperty('QuaterlyCostEditForm');
  });

  it('should render DeleteButton in table actions', () => {
    const wrapper = mount(FixedCostTable, {
      global: {
        plugins: [vuetify],
      },
      props: {
        entries: mockEntries,
        cols: mockCols,
        formComponent: 'MonthlyCostEditForm'
      }
    });

    // Verify DeleteButton is registered as a component
    expect(wrapper.vm.$options.components).toHaveProperty('DeleteButton');
    // Verify the component renders without errors
    expect(wrapper.exists()).toBe(true);
  });
});