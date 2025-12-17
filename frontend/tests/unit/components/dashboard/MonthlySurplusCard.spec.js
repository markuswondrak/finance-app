import { mount, flushPromises } from '@vue/test-utils';
import MonthlySurplusCard from '@/components/dashboard/MonthlySurplusCard.vue';
import { statisticsService } from '@/services/statistics';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Mock the service
vi.mock('@/services/statistics');

const vuetify = createVuetify({
  components,
  directives,
});

// Mock Chart.js/vue-chartjs to avoid canvas issues in JSDOM
vi.mock('vue-chartjs', () => ({
  Line: {
    template: '<div class="mock-line-chart"></div>',
    props: ['data', 'options']
  }
}));

describe('MonthlySurplusCard.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with positive surplus', async () => {
    const mockData = {
      current_surplus: 500.50,
      monthly_income: 2000,
      monthly_expenses: 1499.50,
      history: []
    };
    statisticsService.getSurplusStatistics.mockResolvedValue(mockData);

    const wrapper = mount(MonthlySurplusCard, {
      global: {
        plugins: [vuetify],
      },
    });

    // Initial state (loading)
    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);

    await flushPromises();

    // Loaded state
    expect(wrapper.text()).toContain('Monatlicher Überschuss');
    expect(wrapper.text()).toContain('500,50');
    expect(wrapper.find('.text-positive').exists()).toBe(true);
    expect(wrapper.find('.text-negative').exists()).toBe(false);
  });

  it('renders correctly with negative surplus', async () => {
    const mockData = {
      current_surplus: -200.00,
      monthly_income: 1000,
      monthly_expenses: 1200,
      history: []
    };
    statisticsService.getSurplusStatistics.mockResolvedValue(mockData);

    const wrapper = mount(MonthlySurplusCard, {
      global: {
        plugins: [vuetify],
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('-200,00');
    expect(wrapper.find('.text-negative').exists()).toBe(true);
    expect(wrapper.find('.text-positive').exists()).toBe(false);
  });

  it('renders chart when history is available', async () => {
    const mockData = {
      current_surplus: 500.50,
      monthly_income: 2000,
      monthly_expenses: 1499.50,
      history: [
          { month: '2023-01', surplus: 100 },
          { month: '2023-02', surplus: 200 }
      ]
    };
    statisticsService.getSurplusStatistics.mockResolvedValue(mockData);

    const wrapper = mount(MonthlySurplusCard, {
      global: {
        plugins: [vuetify],
      },
    });

    await flushPromises();

    expect(wrapper.find('.sparkline-container').exists()).toBe(true);
    // Since we mocked Line, we can check for the mock class
    expect(wrapper.find('.mock-line-chart').exists()).toBe(true);
  });
});
