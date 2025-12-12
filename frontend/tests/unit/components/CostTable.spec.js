import { shallowMount, createLocalVue } from '@vue/test-utils';
import CostTable from '@/components/CostTable.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('CostTable.vue', () => {
  let vuetify;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  const mockEntries = [
    { id: 1, name: 'Rent', amount: 1000, category: 'Housing' },
    { id: 2, name: 'Salary', amount: 3000, category: 'Income' },
    { id: 3, name: 'Utilities', amount: 200, category: 'Housing' }
  ];

  const mockCols = [
    { name: 'name', label: 'Name', styleClass: 'name-col' },
    { name: 'amount', label: 'Amount', styleClass: 'amount-col' },
    { name: 'category', label: 'Category', styleClass: 'category-col' }
  ];

  it('should render with entries and columns', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    expect(wrapper.props().entries).toEqual(mockEntries);
    expect(wrapper.props().cols).toEqual(mockCols);
  });

  it('should display table when entries exist', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    expect(wrapper.vm.empty).toBe(false);
    const table = wrapper.findComponent({ name: 'v-simple-table' });
    expect(table.exists()).toBe(true);
  });

  it('should display empty message when no entries', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: [],
        cols: mockCols
      }
    });

    expect(wrapper.vm.empty).toBe(true);
    expect(wrapper.text()).toContain('Keine Einträge bisher');
  });

  it('should display empty message when entries is null', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: null,
        cols: mockCols
      }
    });

    expect(wrapper.vm.empty).toBe(true);
    expect(wrapper.text()).toContain('Keine Einträge bisher');
  });

  it('should render table headers with correct labels', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const headers = wrapper.findAll('th');
    expect(headers.at(0).text()).toBe('Name');
    expect(headers.at(1).text()).toBe('Amount');
    expect(headers.at(2).text()).toBe('Category');
  });

  it('should apply style classes to headers', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const headers = wrapper.findAll('th');
    expect(headers.at(0).classes()).toContain('name-col');
    expect(headers.at(1).classes()).toContain('amount-col');
    expect(headers.at(2).classes()).toContain('category-col');
  });

  it('should render correct number of rows', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(mockEntries.length);
  });

  it('should display entry data in table cells', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const firstRowCells = wrapper.findAll('tbody tr').at(0).findAll('td');
    expect(firstRowCells.at(0).text()).toBe('Rent');
    expect(firstRowCells.at(1).text()).toBe('1000');
    expect(firstRowCells.at(2).text()).toBe('Housing');
  });

  it('should apply transformers to column values', () => {
    const colsWithTransformer = [
      { name: 'name', label: 'Name' },
      {
        name: 'amount',
        label: 'Amount',
        transformer: (val) => `$${val}`
      }
    ];

    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: colsWithTransformer
      }
    });

    const firstRowCells = wrapper.findAll('tbody tr').at(0).findAll('td');
    expect(firstRowCells.at(1).text()).toBe('$1000');
  });

  it('should not transform values when no transformer is provided', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const firstRowCells = wrapper.findAll('tbody tr').at(0).findAll('td');
    expect(firstRowCells.at(0).text()).toBe('Rent');
  });

  it('should filter columns based on breakpoint when hide is true', () => {
    const colsWithHide = [
      { name: 'name', label: 'Name', hide: false },
      { name: 'amount', label: 'Amount', hide: true },
      { name: 'category', label: 'Category', hide: false }
    ];

    const wrapper = shallowMount(CostTable, {
      vuetify: new Vuetify(),
      localVue,
      propsData: {
        entries: mockEntries,
        cols: colsWithHide
      },
      computed: {
        '$vuetify'() {
          return {
            breakpoint: {
              mdAndUp: false
            }
          };
        }
      }
    });

    const headers = wrapper.findAll('th');
    const headerTexts = headers.wrappers.map(h => h.text()).filter(t => t);
    expect(headerTexts).not.toContain('Amount');
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('Category');
  });

  it('should show hidden columns on desktop', () => {
    const colsWithHide = [
      { name: 'name', label: 'Name', hide: false },
      { name: 'amount', label: 'Amount', hide: true },
      { name: 'category', label: 'Category', hide: false }
    ];

    const wrapper = shallowMount(CostTable, {
      vuetify: new Vuetify(),
      localVue,
      propsData: {
        entries: mockEntries,
        cols: colsWithHide
      },
      computed: {
        '$vuetify'() {
          return {
            breakpoint: {
              mdAndUp: true
            }
          };
        }
      }
    });

    const headers = wrapper.findAll('th');
    const headerTexts = headers.wrappers.map(h => h.text()).filter(t => t);
    expect(headerTexts).toContain('Amount');
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('Category');
  });

  it('should render DeleteButton for each entry', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const deleteButtons = wrapper.findAllComponents({ name: 'DeleteButton' });
    expect(deleteButtons).toHaveLength(mockEntries.length);
  });

  it('should pass entry name to DeleteButton', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const deleteButtons = wrapper.findAllComponents({ name: 'DeleteButton' });
    expect(deleteButtons.at(0).props().name).toBe('Rent');
    expect(deleteButtons.at(1).props().name).toBe('Salary');
    expect(deleteButtons.at(2).props().name).toBe('Utilities');
  });

  it('should emit delelete-clicked event when delete is confirmed', async () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const deleteButtons = wrapper.findAllComponents({ name: 'DeleteButton' });
    deleteButtons.at(0).vm.$emit('confirm');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()['delete-clicked']).toBeTruthy();
    expect(wrapper.emitted()['delete-clicked'][0]).toEqual([mockEntries[0]]);
  });

  it('should have fixed-header on table', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const table = wrapper.findComponent({ name: 'v-simple-table' });
    expect(table.props().fixedHeader).toBe(true);
  });

  it('should render header slot content', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      },
      slots: {
        header: '<th class="custom-header">Custom</th>'
      }
    });

    expect(wrapper.html()).toContain('custom-header');
  });

  it('should render content slot with entry data', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      },
      scopedSlots: {
        content: '<td class="custom-content">{{ props.entry.name }}</td>'
      }
    });

    expect(wrapper.html()).toContain('custom-content');
  });

  it('should initialize showDelete to false', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    expect(wrapper.vm.showDelete).toBe(false);
  });

  it('should handle empty cols array', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: []
      }
    });

    const headers = wrapper.findAll('th');
    expect(headers.length).toBeGreaterThanOrEqual(1);
  });

  it('should have action cell with right alignment', () => {
    const wrapper = shallowMount(CostTable, {
      vuetify,
      localVue,
      localVue,
      propsData: {
        entries: mockEntries,
        cols: mockCols
      }
    });

    const actionCells = wrapper.findAll('.action-cell');
    expect(actionCells.length).toBeGreaterThan(0);
    expect(actionCells.at(0).attributes().align).toBe('right');
  });
});
