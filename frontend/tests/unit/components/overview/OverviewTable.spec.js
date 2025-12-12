import { shallowMount, createLocalVue } from '@vue/test-utils';
import OverviewTable from '@/components/overview/OverviewTable.vue';
import { toCurrency } from '@/components/Utils';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);
Vue.filter('currency', toCurrency);

describe('OverviewTable.vue', () => {
    let vuetify;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        vuetify = new Vuetify();
    });

    const mockEntries = [
        {
            yearMonth: { year: 2023, month: 1 },
            sumFixedCosts: 100,
            sumSpecialCosts: 50,
            currentAmount: 850,
            empty: false
        },
        {
            yearMonth: { year: 2023, month: 2 },
            sumFixedCosts: 100,
            sumSpecialCosts: 0,
            currentAmount: 950,
            empty: false
        }
    ];

    it('should render table rows for entries', () => {
        const wrapper = shallowMount(OverviewTable, {
            vuetify,
            localVue,
            propsData: {
                entries: mockEntries
            }
        });

        const rows = wrapper.findAll('tbody tr');
        expect(rows).toHaveLength(2);
    });

    it('should display correct data in columns', () => {
        const wrapper = shallowMount(OverviewTable, {
            vuetify,
            localVue,
            propsData: {
                entries: mockEntries
            }
        });

        const firstRowCells = wrapper.findAll('tbody tr').at(0).findAll('td');
        // Month
        expect(firstRowCells.at(0).text()).toContain('Januar / 2023');
        // Fixed Costs
        expect(firstRowCells.at(1).text()).toContain('100 €');
        // Special Costs
        expect(firstRowCells.at(2).text()).toContain('50 €');
        // Balance
        expect(firstRowCells.at(3).text()).toContain('850 €');
    });

    it('should apply negative-amount class for negative balance', () => {
        const entries = [{ ...mockEntries[0], currentAmount: -100 }];
        const wrapper = shallowMount(OverviewTable, {
            vuetify,
            localVue,
            propsData: {
                entries
            }
        });

        const cell = wrapper.find('.amount');
        expect(cell.classes()).toContain('negative-amount');
    });

    it('should render OverviewDetails and SpecialCostForm', () => {
        const wrapper = shallowMount(OverviewTable, {
            vuetify,
            localVue,
            propsData: {
                entries: mockEntries
            }
        });

        expect(wrapper.findComponent({ name: 'OverviewDetails' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'SpecialCostForm' }).exists()).toBe(true);
    });
});
