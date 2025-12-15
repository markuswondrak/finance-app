import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Overview from '@/components/overview/Overview.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Stub for VSkeletonLoader to avoid issues with missing types in test env
const VSkeletonLoaderStub = {
    name: 'VSkeletonLoader',
    template: '<div class="v-skeleton-loader-stub"><slot /></div>',
    props: ['type', 'loading', 'transition']
};

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

    it('should fetch data on created', async () => {
        const ForecastChartStub = { name: 'ForecastChart', template: '<div></div>', props: ['data'] };
        const KPISectionStub = { name: 'KPISection', template: '<div></div>', props: ['metrics', 'loading'] };
        const OverviewTableStub = { name: 'OverviewTable', template: '<div></div>' };

        const wrapper = mount(Overview, {
            global: {
                plugins: [vuetify],
                stubs: {
                    ForecastChart: ForecastChartStub,
                    KPISection: KPISectionStub,
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
        const ForecastChartStub = { name: 'ForecastChart', template: '<div></div>', props: ['data'] };
        const KPISectionStub = { name: 'KPISection', template: '<div></div>', props: ['metrics', 'loading'] };
        const OverviewTableStub = { name: 'OverviewTable', template: '<div></div>' };

        const wrapper = mount(Overview, {
            global: {
                plugins: [vuetify],
                stubs: {
                    ForecastChart: ForecastChartStub,
                    KPISection: KPISectionStub,
                    OverviewTable: OverviewTableStub,
                    VSkeletonLoader: VSkeletonLoaderStub
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.findComponent({ name: 'ForecastChart' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'KPISection' }).exists()).toBe(true);
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

            const ForecastChartStub = {
                name: 'ForecastChart',
                template: '<div class="chart-stub"></div>',
                props: ['data']
            };
            const KPISectionStub = { name: 'KPISection', template: '<div></div>', props: ['metrics', 'loading'] };
            const OverviewTableStub = { name: 'OverviewTable', template: '<div></div>', props: ['entries'] };

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        KPISection: KPISectionStub,
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
            // Check if data transformation is correct
            expect(chartData.labels).toHaveLength(3);
            expect(chartData.labels[0]).toContain('Januar'); // displayMonth might format differently based on logic but should contain month
            expect(chartData.datasets[0].data).toEqual([1500, 800, 300]);
        });

        it('should pass entries to OverviewTable for table rendering', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            const ForecastChartStub = { name: 'ForecastChart', template: '<div></div>', props: ['data'] };
            const KPISectionStub = { name: 'KPISection', template: '<div></div>', props: ['metrics', 'loading'] };
            const OverviewTableStub = {
                name: 'OverviewTable',
                template: '<div class="table-stub"></div>',
                props: ['entries']
            };

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        KPISection: KPISectionStub,
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

        it('should pass metrics to KPISection component', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            const ForecastChartStub = { name: 'ForecastChart', template: '<div></div>', props: ['data'] };
            const KPISectionStub = {
                name: 'KPISection',
                template: '<div class="kpi-stub"></div>',
                props: ['metrics', 'loading']
            };
            const OverviewTableStub = { name: 'OverviewTable', template: '<div></div>', props: ['entries'] };

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        KPISection: KPISectionStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            const kpiSection = wrapper.findComponent({ name: 'KPISection' });
            expect(kpiSection.exists()).toBe(true);
            expect(kpiSection.props('metrics')).toHaveLength(3);
            expect(kpiSection.props('loading')).toBe(false);
        });

        it('should show skeleton loaders while loading', async () => {
            // Create a promise that won't resolve immediately
            let resolvePromise;
            const pendingPromise = new Promise(resolve => {
                resolvePromise = resolve;
            });

            global.fetch = vi.fn().mockReturnValue(pendingPromise);

            const ForecastChartStub = { name: 'ForecastChart', template: '<div></div>', props: ['data'] };
            const KPISectionStub = { name: 'KPISection', template: '<div></div>', props: ['metrics', 'loading'] };
            const OverviewTableStub = { name: 'OverviewTable', template: '<div></div>', props: ['entries'] };

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        KPISection: KPISectionStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            // Before data loads, loaded should be false
            expect(wrapper.vm.loaded).toBe(false);

            // Verify skeleton loaders are present (chart and table have v-if skeleton loaders)
            // KPISection handles its own loading state via props
            const skeletonLoaders = wrapper.findAllComponents({ name: 'VSkeletonLoader' });
            expect(skeletonLoaders.length).toBe(2); // Chart and Table skeletons

            // Resolve the fetch
            resolvePromise({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            // After data loads, loaded should be true
            expect(wrapper.vm.loaded).toBe(true);

            // After loading, skeleton loaders should not be present
            const skeletonLoadersAfter = wrapper.findAllComponents({ name: 'VSkeletonLoader' });
            expect(skeletonLoadersAfter.length).toBe(0);
        });

        it('should display all three overview components in correct order', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(detailedMockApiResult)
            });

            const ForecastChartStub = { name: 'ForecastChart', template: '<div data-testid="chart"></div>', props: ['data'] };
            const KPISectionStub = { name: 'KPISection', template: '<div data-testid="kpi"></div>', props: ['metrics', 'loading'] };
            const OverviewTableStub = { name: 'OverviewTable', template: '<div data-testid="table"></div>', props: ['entries'] };

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        KPISection: KPISectionStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 0));

            // All components should be rendered
            expect(wrapper.find('[data-testid="chart"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="kpi"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="table"]').exists()).toBe(true);

            // Check container structure - 3 rows for chart, kpi, table
            const rows = wrapper.findAllComponents({ name: 'VRow' });
            expect(rows.length).toBe(3);
        });

        it('should handle empty entries gracefully', async () => {
            const emptyMockResult = {
                entries: [],
                currentAmount: 0
            };

            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue(emptyMockResult)
            });

            const ForecastChartStub = { name: 'ForecastChart', template: '<div></div>', props: ['data'] };
            const KPISectionStub = { name: 'KPISection', template: '<div></div>', props: ['metrics', 'loading'] };
            const OverviewTableStub = { name: 'OverviewTable', template: '<div></div>', props: ['entries'] };

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        KPISection: KPISectionStub,
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
            const kpiSection = wrapper.findComponent({ name: 'KPISection' });

            // ForecastChart receives null when data is empty
            expect(chart.props('data')).toBeNull();
            expect(table.props('entries')).toEqual([]);
            expect(kpiSection.props('metrics')).toEqual([]);
        });

        it('should handle API error gracefully', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const ForecastChartStub = { name: 'ForecastChart', template: '<div></div>', props: ['data'] };
            const KPISectionStub = { name: 'KPISection', template: '<div></div>', props: ['metrics', 'loading'] };
            const OverviewTableStub = { name: 'OverviewTable', template: '<div></div>', props: ['entries'] };

            // Capture errors thrown from the created hook (LoadablePage re-throws after setting loaded='error')
            const caughtErrors = [];
            const errorHandler = (err) => caughtErrors.push(err);

            const wrapper = mount(Overview, {
                global: {
                    plugins: [vuetify],
                    stubs: {
                        ForecastChart: ForecastChartStub,
                        KPISection: KPISectionStub,
                        OverviewTable: OverviewTableStub,
                        VSkeletonLoader: VSkeletonLoaderStub
                    },
                    config: {
                        errorHandler
                    }
                }
            });

            // Wait for the created hook to complete
            await vi.waitFor(() => {
                expect(wrapper.vm.loaded).toBe('error');
            });

            // Verify the error was caught by Vue's error handler
            expect(caughtErrors.length).toBe(1);
            expect(caughtErrors[0].message).toBe('Network error');
        });
    });
});