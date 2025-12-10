import { shallowMount, createLocalVue } from '@vue/test-utils';
import FixedCosts from '@/components/FixedCosts.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('FixedCosts.vue', () => {
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

  const mockApiData = {
    monthly: [
      { id: 1, name: 'Rent', amount: 1000 }
    ],
    quaterly: [
      { id: 2, name: 'Insurance', amount: 300, dueMonth: 1 }
    ],
    halfyearly: [
      { id: 3, name: 'Car Tax', amount: 200, dueMonth: 1 }
    ],
    yearly: [
      { id: 4, name: 'Annual Fee', amount: 100, dueMonth: 1 }
    ],
    currentBalance: 500
  };

  it('should render container', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    const container = wrapper.findComponent({ name: 'v-container' });
    expect(container.exists()).toBe(true);
  });

  it('should initialize with default data', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    expect(wrapper.vm.monthly).toEqual([]);
    expect(wrapper.vm.quaterly).toEqual([]);
    expect(wrapper.vm.halfyearly).toEqual([]);
    expect(wrapper.vm.yearly).toEqual([]);
    expect(wrapper.vm.currentBalance).toBe(-1);
    expect(wrapper.vm.tab).toBeNull();
  });

  it('should fetch data on created', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(global.fetch).toHaveBeenCalledWith('/api/costs');
  });

  it('should set data from API response', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(wrapper.vm.monthly).toEqual(mockApiData.monthly);
    expect(wrapper.vm.quaterly).toEqual(mockApiData.quaterly);
    expect(wrapper.vm.halfyearly).toEqual(mockApiData.halfyearly);
    expect(wrapper.vm.yearly).toEqual(mockApiData.yearly);
    expect(wrapper.vm.currentBalance).toBe(500);
  });

  it('should display current balance', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.currentBalanceDisplay).toBe('500 €');
  });

  it('should apply red class when balance is negative', async () => {
    const negativeBalanceData = {
      ...mockApiData,
      currentBalance: -100
    };

    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(negativeBalanceData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(wrapper.vm.currentBalance).toBe(-100);
  });

  it('should have four tabs for different cost frequencies', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    const tabs = wrapper.findAllComponents({ name: 'v-tab' });
    expect(tabs).toHaveLength(4);
  });

  it('should have correct tab labels', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    const tabs = wrapper.findAllComponents({ name: 'v-tab' });
    expect(tabs.at(0).text()).toBe('Monatliche Kosten');
    expect(tabs.at(1).text()).toBe('Vierteljährliche Kosten');
    expect(tabs.at(2).text()).toBe('Halbjährliche Kosten');
    expect(tabs.at(3).text()).toBe('Jährliche Kosten');
  });

  it('should render FixedCostsTable for each tab', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    const tables = wrapper.findAllComponents({ name: 'FixedCostsTable' });
    expect(tables).toHaveLength(4);
  });

  it('should pass correct data to monthly costs table', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    const tables = wrapper.findAllComponents({ name: 'FixedCostsTable' });
    expect(tables.at(0).props().entries).toEqual(mockApiData.monthly);
    expect(tables.at(0).props().formComponent).toBe('monthly-cost-edit-form');
  });

  it('should pass correct data to quarterly costs table', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    const tables = wrapper.findAllComponents({ name: 'FixedCostsTable' });
    expect(tables.at(1).props().entries).toEqual(mockApiData.quaterly);
    expect(tables.at(1).props().formComponent).toBe('quaterly-cost-edit-form');
  });

  it('should pass correct data to half-yearly costs table', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    const tables = wrapper.findAllComponents({ name: 'FixedCostsTable' });
    expect(tables.at(2).props().entries).toEqual(mockApiData.halfyearly);
    expect(tables.at(2).props().formComponent).toBe('halfyearly-cost-edit-form');
  });

  it('should pass correct data to yearly costs table', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    const tables = wrapper.findAllComponents({ name: 'FixedCostsTable' });
    expect(tables.at(3).props().entries).toEqual(mockApiData.yearly);
    expect(tables.at(3).props().formComponent).toBe('yearly-cost-edit-form');
  });

  it('should show skeleton loaders when loading', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    const skeletonLoaders = wrapper.findAllComponents({ name: 'v-skeleton-loader' });
    expect(skeletonLoaders.length).toBeGreaterThan(0);
  });

  it('should have column definitions for all cost types', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    expect(wrapper.vm.monthlyCols).toBeDefined();
    expect(wrapper.vm.quaterlyCols).toBeDefined();
    expect(wrapper.vm.halfyearlyCols).toBeDefined();
    expect(wrapper.vm.yearlyCols).toBeDefined();
  });

  it('should use LoadablePage mixin', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    expect(wrapper.vm.loaded).toBeDefined();
    expect(wrapper.vm.fetchData).toBeDefined();
  });

  it('should display banner with current balance text', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    const banner = wrapper.findComponent({ name: 'v-banner' });
    expect(banner.exists()).toBe(true);
    expect(banner.text()).toContain('Aktuelle Bilanz (pro Monat)');
  });

  it('should have wallet icon on banner', () => {
    global.fetch.mockResolvedValue({
      json: jest.fn(() => Promise.resolve(mockApiData))
    });

    const wrapper = shallowMount(FixedCosts, {
      vuetify,
      localVue
    });

    const banner = wrapper.findComponent({ name: 'v-banner' });
    expect(banner.props().icon).toBe('fa-wallet');
  });
});
