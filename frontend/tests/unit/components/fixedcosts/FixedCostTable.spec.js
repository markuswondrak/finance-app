import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FixedCostTable from '@/components/fixedcosts/FixedCostTable.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import BaseTable from '@/components/common/BaseTable.vue';

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

  it('should wrap content in BaseTable', () => {
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

    const baseTable = wrapper.findComponent(BaseTable);
    expect(baseTable.exists()).toBe(true);
  });

  it('should render table rows based on entries', () => {
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

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(mockEntries.length);
  });

  it('should render add new costs button', () => {
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

    expect(wrapper.props().formComponent).toBe('MonthlyCostEditForm');
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

    expect(wrapper.props().formComponent).toBe('QuaterlyCostEditForm');
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

    expect(wrapper.vm.$options.components).toHaveProperty('DeleteButton');
    expect(wrapper.exists()).toBe(true);
  });
});