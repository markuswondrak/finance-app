import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import OverviewTable from '@/components/overview/OverviewTable.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('OverviewTable.vue', () => {
    let vuetify;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
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
        const wrapper = mount(OverviewTable, {
            global: { plugins: [vuetify] },
            props: {
                entries: mockEntries
            }
        });

        const rows = wrapper.findAll('tbody tr');
        expect(rows).toHaveLength(2);
    });

    it('should display correct data in columns', () => {
        const wrapper = mount(OverviewTable, {
            global: { plugins: [vuetify] },
            props: {
                entries: mockEntries
            }
        });

        const firstRowCells = wrapper.findAll('tbody tr')[0].findAll('td');
        // Month
        expect(firstRowCells[0].text()).toContain('Januar / 2023');
        // Fixed Costs
        expect(firstRowCells[1].text()).toContain('100 €');
        // Special Costs
        expect(firstRowCells[2].text()).toContain('50 €');
        // Balance
        expect(firstRowCells[3].text()).toContain('850 €');
    });

    it('should apply negative-amount class for negative balance', () => {
        const entries = [{ ...mockEntries[0], currentAmount: -100 }];
        const wrapper = mount(OverviewTable, {
            global: { plugins: [vuetify] },
            props: {
                entries
            }
        });

        const cell = wrapper.find('.amount');
        expect(cell.classes()).toContain('negative-amount');
    });

    it('should render OverviewDetails and SpecialCostForm', () => {
        const OverviewDetailsStub = { name: 'OverviewDetails', template: '<div class="overview-details-stub"></div>' };
        const SpecialCostFormStub = { name: 'SpecialCostForm', template: '<div class="special-cost-form-stub"></div>' };

        const wrapper = mount(OverviewTable, {
            global: {
                plugins: [vuetify],
                stubs: {
                    OverviewDetails: OverviewDetailsStub,
                    SpecialCostForm: SpecialCostFormStub
                }
            },
            props: {
                entries: mockEntries
            }
        });

        expect(wrapper.findComponent({ name: 'OverviewDetails' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'SpecialCostForm' }).exists()).toBe(true);
    });
});