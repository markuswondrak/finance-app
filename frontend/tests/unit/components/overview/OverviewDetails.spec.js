import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import OverviewDetails from '@/components/overview/OverviewDetails.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('OverviewDetails.vue', () => {
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

    const mockDetail = { index: 1, yearMonth: { year: 2023, month: 1 } };
    const mockApiResult = {
        fixedCosts: [{ id: 1, name: 'Fix1', amount: 100, displayType: 'M' }],
        specialCosts: [{ id: 2, name: 'Spec1', amount: 50 }]
    };

    it('should render dialog', () => {
        const wrapper = mount(OverviewDetails, {
            global: { plugins: [vuetify] },
            props: { detail: mockDetail }
        });

        expect(wrapper.findComponent({ name: 'VDialog' }).exists()).toBe(true);
    });

    it('should fetch data when dialog opens', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn().mockResolvedValue(mockApiResult)
        });

        const wrapper = mount(OverviewDetails, {
            global: { plugins: [vuetify] },
            props: { detail: mockDetail }
        });

        // Simulate opening dialog by setting data
        await wrapper.setData({ show: true });

        // Wait for fetch
        await wrapper.vm.$nextTick();
        
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/overview/detail?index=1'));
    });

    it('should display costs after loading', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn().mockResolvedValue(mockApiResult)
        });

        const wrapper = mount(OverviewDetails, {
            global: { plugins: [vuetify] },
            props: { detail: mockDetail }
        });

        await wrapper.setData({ show: true });
        
        // Wait for fetch
        await new Promise(resolve => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.fixedCosts).toEqual(mockApiResult.fixedCosts);
        expect(wrapper.vm.specialCosts).toEqual(mockApiResult.specialCosts);
        expect(wrapper.vm.loaded).toBe(true);
    });
});