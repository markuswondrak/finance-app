import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import HalfyearlyCostEditForm from '@/components/editform/HalfyearlyCostEditForm.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('HalfyearlyCostEditForm.vue', () => {
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

    it('should call success on editform after save', async () => {
        global.fetch.mockResolvedValue({});

        const successSpy = vi.fn();
        const CostEditFormStub = {
            name: 'CostEditForm',
            template: '<div><slot></slot></div>',
            methods: { success: successSpy },
            // In Vue 3, template refs are accessed differently but calling method on component instance ref works if methods are exposed?
            // Options API components expose methods by default.
        };

        const wrapper = mount(HalfyearlyCostEditForm, {
            global: { 
                plugins: [vuetify],
                stubs: {
                    CostEditForm: CostEditFormStub
                }
            },
            props: { cost: null }
        });

        wrapper.vm.form.name = 'Half Yearly';
        wrapper.vm.form.amount = 500;
        wrapper.vm.form.dueMonth = 1;

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
        expect(wrapper.emitted('saved')).toBeTruthy();
    });

    it('should initialize logic correctly', () => {
        const wrapper = mount(HalfyearlyCostEditForm, {
            global: { 
                plugins: [vuetify],
                stubs: { CostEditForm: { template: '<div><slot></slot></div>', methods: { success: () => { } } } }
            },
            props: { cost: null }
        });
        expect(wrapper.vm.items).toBeDefined();
        expect(wrapper.vm.items.length).toBeGreaterThan(0);
    });
});