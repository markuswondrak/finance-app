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
        expect(firstRowCells[1].text()).toContain('100,00');
        // Special Costs
        expect(firstRowCells[2].text()).toContain('50,00');
        // Balance
        expect(firstRowCells[3].text()).toContain('850,00');
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

    it('should create cost object with correct dueDate', () => {
        const wrapper = mount(OverviewTable, {
            global: { plugins: [vuetify] },
            props: { entries: [] }
        });

        const yearMonth = { year: 2023, month: 5 };
        const cost = wrapper.vm.cost(1, yearMonth);

        expect(cost).toEqual({
            index: 1,
            name: "",
            amount: 0,
            dueDate: yearMonth
        });
    });

    it('should emit refresh event when SpecialCostForm emits refresh', async () => {
        const SpecialCostFormStub = { 
            name: 'SpecialCostForm', 
            template: '<div class="special-cost-form-stub"></div>', 
            emits: ['refresh'] 
        };

        const wrapper = mount(OverviewTable, {
            global: {
                plugins: [vuetify],
                stubs: {
                    SpecialCostForm: SpecialCostFormStub,
                    OverviewDetails: true // Stub other children
                }
            },
            props: {
                entries: mockEntries
            }
        });

        const specialCostForm = wrapper.findComponent(SpecialCostFormStub);
        await specialCostForm.vm.$emit('refresh');

        expect(wrapper.emitted('refresh')).toBeTruthy();
    });

    it('should format large numbers correctly in responsive mode', () => {
        // Mock window.innerWidth to trigger responsive formatting
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });

        const entries = [{
            yearMonth: { year: 2023, month: 1 },
            sumFixedCosts: 12000,
            sumSpecialCosts: 0,
            currentAmount: 0,
            empty: false
        }];

        const wrapper = mount(OverviewTable, {
            global: { plugins: [vuetify] },
            props: {
                entries
            }
        });

        const firstRowCells = wrapper.findAll('tbody tr')[0].findAll('td');
        const text = firstRowCells[1].text();

        // The bug causes "Tundefined", we want "12T€"
        expect(text).toBe('12T€'); 
    });
});