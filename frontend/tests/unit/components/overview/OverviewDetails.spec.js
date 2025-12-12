import { shallowMount, createLocalVue } from '@vue/test-utils';
import OverviewDetails from '@/components/overview/OverviewDetails.vue';
import { toCurrency } from '@/components/Utils';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);
Vue.filter('currency', toCurrency);
Vue.filter('displayLongMonth', (val) => val ? `${val.month}/${val.year}` : '');

describe('OverviewDetails.vue', () => {
    let vuetify;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        vuetify = new Vuetify();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        global.fetch.mockRestore();
    });

    const mockDetail = { index: 1, yearMonth: { year: 2023, month: 1 } };
    const mockApiResult = {
        fixedCosts: [{ id: 1, name: 'Fix1', amount: 100, displayType: 'M' }],
        specialCosts: [{ id: 2, name: 'Spec1', amount: 50 }]
    };

    it('should render dialog', () => {
        const wrapper = shallowMount(OverviewDetails, {
            vuetify,
            localVue,
            propsData: { detail: mockDetail }
        });

        expect(wrapper.findComponent({ name: 'v-dialog' }).exists()).toBe(true);
    });

    it('should fetch data when dialog opens', async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockApiResult)
        });

        const wrapper = shallowMount(OverviewDetails, {
            vuetify,
            localVue,
            propsData: { detail: mockDetail }
        });

        // Simulate opening dialog by setting data
        wrapper.setData({ show: true });

        // Wait for fetch
        await wrapper.vm.$nextTick();
        // And wait for async fetch fetchData to resolve?
        // fetchData is called. it is async.
        // We can wait a bit or use flushPromises. 
        // Or just check if fetch was called.

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/overview/detail?index=1'));
    });

    it('should display costs after loading', async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockApiResult)
        });

        const wrapper = shallowMount(OverviewDetails, {
            vuetify,
            localVue,
            propsData: { detail: mockDetail }
        });

        wrapper.setData({ show: true });
        // Manually force data update to simulate load completion if fetch is tricky to await perfectly without flushPromises
        // But since we mock fetch, we can await wrapper.vm.loadData(1) if we called it manually?
        // But it's called by watcher.

        // Wait for promise chain
        await new Promise(resolve => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.fixedCosts).toEqual(mockApiResult.fixedCosts);
        expect(wrapper.vm.specialCosts).toEqual(mockApiResult.specialCosts);

        // Check rendering ? (v-simple-table hidden in skeleton loader?)
        // skeleton loader :loading="!loaded"
        expect(wrapper.vm.loaded).toBe(true);
    });
});
