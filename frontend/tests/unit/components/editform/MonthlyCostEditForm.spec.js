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

    const CostEditFormStub = {
        name: 'CostEditForm',
        template: '<div><slot></slot></div>',
        methods: {
            success: vi.fn(),
            resetValidation: vi.fn()
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
        expect(wrapper.vm.form.type).toBe('expense'); // Default
        expect(wrapper.vm.form.fromTo.from).toBeNull();
    });

    it('should initialize with cost data (Income)', () => {
        const cost = {
            id: 1,
            name: 'Salary',
            amount: 2000,
            from: '2023-01',
            to: null,
            isSaving: false
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

        expect(wrapper.vm.form.type).toBe('income');
    });

    it('should initialize with cost data (Saving)', () => {
        const cost = {
            id: 2,
            name: 'ETF',
            amount: -500,
            from: '2023-01',
            to: null,
            isSaving: true
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

        expect(wrapper.vm.form.type).toBe('saving');
    });

    it('should save cost to API with correct mapping', async () => {
        global.fetch.mockResolvedValue({ ok: true });

        const wrapper = mount(MonthlyCostEditForm, {
            global: {
                plugins: [vuetify],
                stubs: { CostEditForm: CostEditFormStub }
            },
            props: {
                cost: null
            }
        });

        wrapper.vm.form.name = 'Savings Plan';
        wrapper.vm.form.amount = 100;
        wrapper.vm.form.type = 'saving';

        await wrapper.vm.saveCost();

        expect(global.fetch).toHaveBeenCalledWith('/api/costs/monthly', expect.objectContaining({
            method: 'post',
            body: expect.stringContaining('"isSaving":true')
        }));
        // Since it's saving, amount should be negative (expense behavior)
        // Verify baseFormToCost logic in integration or unit test of utils.
        // Here we just check if payload contains what we expect. 
        // Note: fetch body is stringified, so regex check or exact string check is needed.
        // But amount logic is inside formToCost utils.
    });

    it('should call success on editform after save', async () => {
        global.fetch.mockResolvedValue({ ok: true });

        const successSpy = vi.fn();
        const LocalStub = {
            name: 'CostEditForm',
            template: '<div><slot></slot></div>',
            methods: {
                success: successSpy,
                resetValidation: vi.fn()
            },
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
        expect(wrapper.emitted('saved')).toBeTruthy();
    });

    it('should call error on editform when API returns error', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 500 });

        const successSpy = vi.fn();
        const errorSpy = vi.fn();
        const LocalStub = {
            name: 'CostEditForm',
            template: '<div><slot></slot></div>',
            methods: {
                success: successSpy,
                error: errorSpy,
                resetValidation: vi.fn()
            },
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

        expect(successSpy).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
        expect(wrapper.emitted('saved')).toBeFalsy();
    });
});
