import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import OverviewChart from '@/components/overview/OverviewChart.vue';
import { Line } from 'vue-chartjs';

// Mock chart.js to avoid canvas errors in JSDOM
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
}));

describe('OverviewChart.vue', () => {
  const mockEntries = [
    { yearMonth: { year: 2024, month: 1 }, currentAmount: 100 },
    { yearMonth: { year: 2024, month: 2 }, currentAmount: 200 }
  ];

  it('should compute chart data correctly', () => {
    const wrapper = mount(OverviewChart, {
      props: { entries: mockEntries }
    });

    const data = wrapper.vm.chartData;
    // displayMonth function returns "MonthName / Year" format (or month number on small screens)
    expect(data.labels).toHaveLength(2);
    expect(data.datasets[0].data).toEqual([100, 200]);
  });

  it('should render Line chart component', () => {
    const wrapper = mount(OverviewChart, {
      props: { entries: mockEntries }
    });

    const lineChart = wrapper.findComponent(Line);
    expect(lineChart.exists()).toBe(true);
  });

  it('should pass data and options to Line chart', () => {
    const wrapper = mount(OverviewChart, {
      props: { entries: mockEntries }
    });

    const lineChart = wrapper.findComponent(Line);
    expect(lineChart.props().data).toEqual(wrapper.vm.chartData);
    expect(lineChart.props().options).toEqual(wrapper.vm.chartOptions);
  });
});