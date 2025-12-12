import { shallowMount, createLocalVue } from '@vue/test-utils';
import Overview from '@/components/overview/Overview.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('Overview.vue', () => {
    let vuetify;
    let localVue;

    const mockApiResult = {
        entries: [{ id: 1 }, { id: 2 }],
        currentAmount: 1000
    };

    beforeEach(() => {
        localVue = createLocalVue();
        vuetify = new Vuetify();
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockApiResult)
        });
        // Mock localStorage
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn()
        };
        global.localStorage = localStorageMock;
    });

    afterEach(() => {
        global.fetch.mockRestore();
    });

    it('should fetch data on created', async () => {
        const wrapper = shallowMount(Overview, {
            vuetify,
            localVue
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(global.fetch).toHaveBeenCalledWith('/api/overview/all');
        expect(wrapper.vm.entries).toEqual(mockApiResult.entries);
        expect(wrapper.vm.currentAmount).toBe(1000);
        expect(wrapper.vm.loaded).toBe(true);
    });

    it('should render child components', () => {
        const wrapper = shallowMount(Overview, {
            vuetify,
            localVue
        });

        // wrapper.findComponent({ name: 'OverviewChart' })
        expect(wrapper.findComponent({ name: 'OverviewChart' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'CurrentAmount' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'OverviewTable' }).exists()).toBe(true);
    });
});
