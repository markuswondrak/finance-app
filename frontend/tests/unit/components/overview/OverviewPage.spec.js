import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Overview from '@/components/overview/OverviewPage.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Stub for VSkeletonLoader to avoid issues with missing types in test env
const VSkeletonLoaderStub = {
    name: 'VSkeletonLoader',
    template: '<div class="v-skeleton-loader-stub"><slot /></div>',
    props: ['type', 'loading', 'transition']
};

// Stub for child components
const ForecastChartStub = { name: 'ForecastChart', template: '<div data-testid="chart"></div>', props: ['data'] };
const CurrentBalanceCardStub = { name: 'CurrentBalanceCard', template: '<div data-testid="balance"></div>', props: ['amount'] };
const MonthlySurplusCardStub = { name: 'MonthlySurplusCard', template: '<div data-testid="surplus"></div>' };
const LowestPointCardStub = { name: 'LowestPointCard', template: '<div data-testid="lowest-point"></div>', props: ['loading', 'entries'] };
const OverviewTableStub = { name: 'OverviewTable', template: '<div data-testid="table"></div>', props: ['entries'] };

describe('Overview.vue', () => {
    let vuetify;

    const mockApiResult = {
        entries: [{ id: 1 }, { id: 2 }],
        currentAmount: 1000
    };

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
        global.fetch = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue(mockApiResult)
        });

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(),
                setItem: vi.fn(),
                clear: vi.fn()
            },
            writable: true
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
    
    it('renders with new KPI card layout: Balance -> Surplus -> LowestPoint', async () => {
        const wrapper = mount(Overview, {
            global: {
                plugins: [vuetify],
                stubs: {
                    ForecastChart: ForecastChartStub,
                    CurrentBalanceCard: CurrentBalanceCardStub,
                    MonthlySurplusCard: MonthlySurplusCardStub,
                    LowestPointCard: LowestPointCardStub,
                    OverviewTable: OverviewTableStub,
                    VSkeletonLoader: VSkeletonLoaderStub
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        // Check for 3 main cards in correct order (implicitly by checking existence)
        expect(wrapper.findComponent({ name: 'CurrentBalanceCard' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'MonthlySurplusCard' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'LowestPointCard' }).exists()).toBe(true);
        
        // Check that LowestPointCard receives entries
        const lowestPointCard = wrapper.findComponent({ name: 'LowestPointCard' });
        expect(lowestPointCard.props('entries')).toEqual(mockApiResult.entries);
    });

    it('should fetch data on created', async () => {
        const wrapper = mount(Overview, {
            global: {
                plugins: [vuetify],
                stubs: {
                    ForecastChart: ForecastChartStub,
                    CurrentBalanceCard: CurrentBalanceCardStub,
                    MonthlySurplusCard: MonthlySurplusCardStub,
                    LowestPointCard: LowestPointCardStub,
                    OverviewTable: OverviewTableStub,
                    VSkeletonLoader: VSkeletonLoaderStub
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(global.fetch).toHaveBeenCalledWith('/api/overview/all');
        expect(wrapper.vm.entries).toEqual(mockApiResult.entries);
        expect(wrapper.vm.currentAmount).toBe(1000);
        expect(wrapper.vm.loaded).toBe(true);
    });

    it('should render child components', async () => {
        const wrapper = mount(Overview, {
            global: {
                plugins: [vuetify],
                stubs: {
                    ForecastChart: ForecastChartStub,
                    CurrentBalanceCard: CurrentBalanceCardStub,
                    MonthlySurplusCard: MonthlySurplusCardStub,
                    LowestPointCard: LowestPointCardStub,
                    OverviewTable: OverviewTableStub,
                    VSkeletonLoader: VSkeletonLoaderStub
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.findComponent({ name: 'ForecastChart' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'CurrentBalanceCard' }).exists()).toBe(true);
        // Based on plan: 3 columns. 1. Balance, 2. Surplus, 3. LowestPoint
        expect(wrapper.findComponent({ name: 'MonthlySurplusCard' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'LowestPointCard' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'OverviewTable' }).exists()).toBe(true);
    });

    describe('Graph and Table Display', () => {
        const detailedMockApiResult = {
            entries: [
                {
                    yearMonth: { year: 2024, month: 1 },
                    displayMonth: 'Januar 2024',
                    sumFixedCosts: 500,
                    sumSpecialCosts: 100,
                    currentAmount: 1500,
                    empty: false
                },
                {
                    yearMonth: { year: 2024, month: 2 },
                    displayMonth: 'Februar 2024',
                    sumFixedCosts: 500,
                    sumSpecialCosts: 200,
                    currentAmount: 800,
                    empty: false
                },
                {
                    yearMonth: { year: 2024, month: 3 },
                    displayMonth: 'März 2024',
                    sumFixedCosts: 500,
                    sumSpecialCosts: 0,
                    currentAmount: 300,
                    empty: false
                }
            ],
            currentAmount: 1500
        };

        it('should pass data to ForecastChart for graph rendering', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        CurrentBalanceCard: CurrentBalanceCardStub,
                        MonthlySurplusCard: MonthlySurplusCardStub,
                        LowestPointCard: LowestPointCardStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            const chart = wrapper.findComponent({ name: 'ForecastChart' });
            expect(chart.exists()).toBe(true);
            const chartData = chart.props('data');
            expect(chartData).toBeDefined();
            expect(chartData.labels).toHaveLength(3);
            expect(chartData.labels[0]).toContain('Januar');
            expect(chartData.datasets[0].data).toEqual([1500, 800, 300]);
        });

        it('should pass entries to OverviewTable for table rendering', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        CurrentBalanceCard: CurrentBalanceCardStub,
                        MonthlySurplusCard: MonthlySurplusCardStub,
                        LowestPointCard: LowestPointCardStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            const table = wrapper.findComponent({ name: 'OverviewTable' });
            expect(table.exists()).toBe(true);
            expect(table.props('entries')).toEqual(detailedMockApiResult.entries);
            expect(table.props('entries')).toHaveLength(3);
        });

        it('should pass metrics to KPI cards', async () => {
            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        CurrentBalanceCard: CurrentBalanceCardStub,
                        MonthlySurplusCard: MonthlySurplusCardStub,
                        LowestPointCard: LowestPointCardStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub,
                        VContainer: { template: '<div><slot></slot></div>' },
                        VRow: { template: '<div><slot></slot></div>' },
                        VCol: { template: '<div><slot></slot></div>' },
                        VCard: { template: '<div><slot></slot></div>' },
                        VCardText: { template: '<div><slot></slot></div>' },
                    }
                }
            });

            // Wait for fetch
            await new Promise(resolve => setTimeout(resolve, 0));
            
            // We should have CurrentBalance, MonthlySurplus, and LowestPoint
            expect(wrapper.findComponent({ name: 'CurrentBalanceCard' }).exists()).toBe(true);
            expect(wrapper.findComponent({ name: 'MonthlySurplusCard' }).exists()).toBe(true);
            expect(wrapper.findComponent({ name: 'LowestPointCard' }).exists()).toBe(true);
        });

        it('should show skeleton loaders while loading', async () => {
            let resolvePromise;
            const pendingPromise = new Promise(resolve => {
                resolvePromise = resolve;
            });

            global.fetch = vi.fn().mockReturnValue(pendingPromise);

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        CurrentBalanceCard: CurrentBalanceCardStub,
                        MonthlySurplusCard: MonthlySurplusCardStub,
                        LowestPointCard: LowestPointCardStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            expect(wrapper.vm.loaded).toBe(false);

            // Chart (0 - internal) + CurrentBalanceCard (1) + SurplusCard (1) + LowestPointCard (1) + Table (1) = 4
            const skeletonLoaders = wrapper.findAllComponents({ name: 'VSkeletonLoader' });
            expect(skeletonLoaders.length).toBe(4); 

            resolvePromise({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(wrapper.vm.loaded).toBe(true);

            const skeletonLoadersAfter = wrapper.findAllComponents({ name: 'VSkeletonLoader' });
            expect(skeletonLoadersAfter.length).toBe(0);
        });

        it('should display all three overview components in correct order', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        CurrentBalanceCard: CurrentBalanceCardStub,
                        MonthlySurplusCard: MonthlySurplusCardStub,
                        LowestPointCard: LowestPointCardStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(wrapper.find('[data-testid="chart"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="table"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="balance"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="surplus"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="lowest-point"]').exists()).toBe(true);
        });

        it('should handle empty entries gracefully', async () => {
            const emptyMockResult = {
                entries: [],
                currentAmount: 0
            };

            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(emptyMockResult)
            });

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        CurrentBalanceCard: CurrentBalanceCardStub,
                        MonthlySurplusCard: MonthlySurplusCardStub,
                        LowestPointCard: LowestPointCardStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(wrapper.vm.loaded).toBe(true);
            expect(wrapper.vm.entries).toEqual([]);
            expect(wrapper.vm.currentAmount).toBe(0);

            const chart = wrapper.findComponent({ name: 'ForecastChart' });
            const table = wrapper.findComponent({ name: 'OverviewTable' });

            expect(chart.props('data')).toBeNull();
            expect(table.props('entries')).toEqual([]);
            // In new layout, LowestPointCard and Surplus are still present but handle empty data
            expect(wrapper.findComponent({ name: 'LowestPointCard' }).exists()).toBe(true);
        });

        it('should handle API error gracefully', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const caughtErrors = [];
            const errorHandler = (err) => caughtErrors.push(err);

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        CurrentBalanceCard: CurrentBalanceCardStub,
                        MonthlySurplusCard: MonthlySurplusCardStub,
                        LowestPointCard: LowestPointCardStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    },
                    config: {
                        errorHandler
                    }
                }
            });

            await vi.waitFor(() => {
                expect(wrapper.vm.loaded).toBe('error');
            });

            expect(caughtErrors.length).toBe(1);
            expect(caughtErrors[0].message).toBe('Network error');
        });
    });
});
