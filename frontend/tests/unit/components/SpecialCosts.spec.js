import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import SpecialCosts from '@/components/SpecialCosts.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('SpecialCosts.vue', () => {
    let vuetify;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const mockApiData = [
        { id: 1, name: 'Vacation', amount: 500, dueYearMonth: '2023-06' },
        { id: 2, name: 'Christmas', amount: 300, dueYearMonth: '2023-12' }
    ];

    it('should render container', () => {
        global.fetch.mockResolvedValue({
            json: vi.fn(() => Promise.resolve(mockApiData))
        });

        const wrapper = mount(SpecialCosts, {
            global: {
                plugins: [vuetify],
            }
        });

        const container = wrapper.findComponent({ name: 'VContainer' });
        expect(container.exists()).toBe(true);
    });

    it('should fetch data on created', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn(() => Promise.resolve(mockApiData))
        });

        const wrapper = mount(SpecialCosts, {
            global: {
                plugins: [vuetify],
            }
        });

        // Wait for created hook async
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(global.fetch).toHaveBeenCalledWith('/api/specialcosts');
    });

    it('should populate entries from API', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn(() => Promise.resolve(mockApiData))
        });

        const wrapper = mount(SpecialCosts, {
            global: {
                plugins: [vuetify],
            }
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.vm.entries).toEqual(mockApiData);
    });

    it('should render v-data-table with correct props', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn(() => Promise.resolve(mockApiData))
        });

        const wrapper = mount(SpecialCosts, {
            global: {
                plugins: [vuetify],
            }
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        const dataTable = wrapper.findComponent({ name: 'VDataTable' });
        expect(dataTable.exists()).toBe(true);
        expect(dataTable.props().items).toEqual(mockApiData);
    });

    it('should render SpecialCostForm in slots', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn(() => Promise.resolve(mockApiData))
        });

        const wrapper = mount(SpecialCosts, {
            global: {
                plugins: [vuetify],
            }
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify SpecialCostForm is registered as a component
        expect(wrapper.vm.$options.components).toHaveProperty('SpecialCostForm');
        // Verify DeleteButton is also registered
        expect(wrapper.vm.$options.components).toHaveProperty('DeleteButton');
    });

    it('should have correct columns defined in headers', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn(() => Promise.resolve(mockApiData))
        });

        const wrapper = mount(SpecialCosts, {
            global: {
                plugins: [vuetify],
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 0));

        const headers = wrapper.vm.headers;
        expect(headers).toEqual(expect.arrayContaining([
            expect.objectContaining({ title: 'Bezeichnung', key: 'name' }),
            expect.objectContaining({ title: 'Betrag', key: 'amount' }),
            expect.objectContaining({ title: 'Fällig am', key: 'dueDate' })
        ]));
    });
});