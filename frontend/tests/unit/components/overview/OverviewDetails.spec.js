import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import OverviewDetails from '@/components/overview/OverviewDetails.vue';
import SpecialCostForm from '@/components/editform/SpecialCostForm.vue';
import DeleteButton from '@/components/DeleteButton.vue';
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

    it('should reload data when SpecialCostForm emits refresh', async () => {
        global.fetch.mockResolvedValue({
            json: vi.fn().mockResolvedValue(mockApiResult)
        });

        const wrapper = mount(OverviewDetails, {
            global: { plugins: [vuetify] },
            props: { detail: mockDetail }
        });

        await wrapper.setData({ show: true });
        
        // Wait for initial fetch
        await new Promise(resolve => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();
        expect(global.fetch).toHaveBeenCalledTimes(1);

        // Find SpecialCostForm and emit refresh
        const specialCostForm = wrapper.findComponent(SpecialCostForm);
        expect(specialCostForm.exists()).toBe(true);
        await specialCostForm.vm.$emit('refresh');

        // Wait for reload fetch
        await new Promise(resolve => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should call delete API and reload when delete confirmed', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockApiResult)
        });

        const wrapper = mount(OverviewDetails, {
            global: { plugins: [vuetify] },
            props: { detail: mockDetail }
        });

        await wrapper.setData({ show: true });
        
        // Wait for initial fetch
        await new Promise(resolve => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();
        expect(global.fetch).toHaveBeenCalledTimes(1);

        // Find DeleteButton and emit confirm
        const deleteButton = wrapper.findComponent(DeleteButton);
        expect(deleteButton.exists()).toBe(true);
        await deleteButton.vm.$emit('confirm');

        // Verify delete fetch (DELETE method)
        // Note: global.fetch might be called for reload too, so we check calls
        const deleteCall = global.fetch.mock.calls.find(call => call[1]?.method === 'DELETE');
        expect(deleteCall).toBeTruthy();
        expect(deleteCall[0]).toContain('/api/specialcosts/2');

        // Wait for reload fetch
        await new Promise(resolve => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();
        // 1 initial + 1 delete + 1 reload = 3 calls
        expect(global.fetch).toHaveBeenCalledTimes(3);
    });
});