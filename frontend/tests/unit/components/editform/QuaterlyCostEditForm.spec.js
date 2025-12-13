import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import QuaterlyCostEditForm from '@/components/editform/QuaterlyCostEditForm.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('QuaterlyCostEditForm.vue', () => {
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
        const LocalStub = {
            name: 'CostEditForm',
            template: '<div><slot></slot></div>',
            methods: { success: successSpy },
            emits: ['save']
        };

        const wrapper = mount(QuaterlyCostEditForm, {
            global: { 
                plugins: [vuetify],
                stubs: {
                    CostEditForm: LocalStub
                }
            },
            props: { cost: null }
        });

        wrapper.vm.form.name = 'Test Cost';
        wrapper.vm.form.amount = 100;
        wrapper.vm.form.dueMonth = 1;

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
    });

    it('should initialize logic correctly', () => {
        const wrapper = mount(QuaterlyCostEditForm, {
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