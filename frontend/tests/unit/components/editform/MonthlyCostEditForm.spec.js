import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MonthlyCostEditForm from '@/components/editform/MonthlyCostEditForm.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('MonthlyCostEditForm.vue', () => {
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

    // We stub CostEditForm to avoid rendering it fully and check interactions
    const CostEditFormStub = {
        name: 'CostEditForm',
        template: '<div><slot></slot></div>',
        methods: {
            success: vi.fn()
        },
        emits: ['save']
    };

    it('should render correct fields', () => {
        const wrapper = mount(MonthlyCostEditForm, {
            global: { 
                plugins: [vuetify],
                stubs: {
                    CostEditForm: CostEditFormStub,
                    NameTextField: true,
                    CurrencyInput: true,
                    IncomingSelect: true,
                    FromToDateFields: true
                }
            },
            props: {
                cost: null
            }
        });

        expect(wrapper.findComponent({ name: 'NameTextField' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'CurrencyInput' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'IncomingSelect' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'FromToDateFields' }).exists()).toBe(true);
    });

    it('should initialize with empty data when no cost provided', () => {
        const wrapper = mount(MonthlyCostEditForm, {
            global: { 
                plugins: [vuetify],
                stubs: { CostEditForm: CostEditFormStub }
            },
            props: {
                cost: null
            }
        });

        expect(wrapper.vm.form.name).toBe("");
        expect(wrapper.vm.form.amount).toBe(0);
        expect(wrapper.vm.form.incoming).toBe(false);
        expect(wrapper.vm.form.fromTo.from).toBeNull();
    });

    it('should initialize with cost data', () => {
        const cost = {
            id: 1,
            name: 'Salary',
            amount: 2000,
            from: '2023-01',
            to: null
        };

        const wrapper = mount(MonthlyCostEditForm, {
            global: { 
                plugins: [vuetify],
                stubs: { CostEditForm: CostEditFormStub }
            },
            props: {
                cost
            }
        });

        expect(wrapper.vm.form.name).toBe('Salary');
        expect(wrapper.vm.form.amount).toBe(2000);
        expect(wrapper.vm.form.incoming).toBe(true);
        expect(wrapper.vm.form.fromTo.from).toBe('2023-01');
    });

    it('should save cost to API', async () => {
        global.fetch.mockResolvedValue({});

        const wrapper = mount(MonthlyCostEditForm, {
            global: {
                plugins: [vuetify],
                stubs: { CostEditForm: CostEditFormStub }
            },
            props: {
                cost: null
            }
        });

        wrapper.vm.form.name = 'New Cost';
        wrapper.vm.form.amount = 100;

        // Simulate save by calling the component's saveCost method directly
        await wrapper.vm.saveCost();

        expect(global.fetch).toHaveBeenCalledWith('/api/costs/monthly', expect.objectContaining({
            method: 'post',
            body: expect.stringContaining('"name":"New Cost"')
        }));
    });

    it('should call success on editform after save', async () => {
        global.fetch.mockResolvedValue({});

        const successSpy = vi.fn();
        const LocalStub = {
            name: 'CostEditForm',
            template: '<div><slot></slot></div>',
            methods: { success: successSpy },
            emits: ['save']
        };

        const wrapper = mount(MonthlyCostEditForm, {
            global: { 
                plugins: [vuetify],
                stubs: {
                    CostEditForm: LocalStub
                }
            },
            props: { cost: null }
        });

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
    });
});