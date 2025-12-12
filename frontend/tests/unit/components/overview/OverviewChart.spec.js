import { shallowMount, createLocalVue } from '@vue/test-utils';
import OverviewChart from '@/components/overview/OverviewChart.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

// No Global Vuetify needed strictu sensu for Chart but good practice if it used tooltips from Vuetify?
// It extends vue-chartjs Line.
// It does NOT use Vuetify template. It has NO template.
// So Vue.use(Vuetify) is optional but harmless.

describe('OverviewChart.vue', () => {
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
    });

    const mockEntries = [
        { displayMonth: 'Jan', currentAmount: 100 },
        { displayMonth: 'Feb', currentAmount: 200 }
    ];

    it('should compute chart data correctly', () => {
        const wrapper = shallowMount(OverviewChart, {
            localVue,
            propsData: { entries: mockEntries },
            methods: {
                renderLineChart: jest.fn(), // Stub render call
                renderChart: jest.fn()
            }
        });

        const data = wrapper.vm.chartData;
        expect(data.labels).toEqual(['Jan', 'Feb']);
        expect(data.data).toEqual([100, 200]);
    });

    it('should call renderChart on mount', () => {
        const renderChartSpy = jest.fn();
        const wrapper = shallowMount(OverviewChart, {
            localVue,
            propsData: { entries: mockEntries },
            methods: {
                renderChart: renderChartSpy // We mock the method from Mixin/Base
            }
        });

        expect(renderChartSpy).toHaveBeenCalled();
    });

    it('should re-render on entries change', async () => {
        const renderLineChartSpy = jest.fn();
        const wrapper = shallowMount(OverviewChart, {
            localVue,
            propsData: { entries: mockEntries },
            methods: {
                renderLineChart: renderLineChartSpy,
                renderChart: jest.fn()
            }
        });

        wrapper.setProps({ entries: [] });
        await wrapper.vm.$nextTick();

        // Initial call + Watcher call = 2
        expect(renderLineChartSpy).toHaveBeenCalledTimes(2);
    });
});
