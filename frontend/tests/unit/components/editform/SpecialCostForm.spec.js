import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import SpecialCostForm from '@/components/editform/SpecialCostForm.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('SpecialCostForm.vue', () => {
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

        const wrapper = mount(SpecialCostForm, {
            global: { 
                plugins: [vuetify],
                stubs: {
                    CostEditForm: LocalStub
                }
            },
            props: { cost: null }
        });

        wrapper.vm.form.name = 'Special Cost';
        wrapper.vm.form.amount = 1000;
        wrapper.vm.form.dueDate = '2023-10';

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
    });

    it('should render MonthDatePicker', () => {
        const wrapper = mount(SpecialCostForm, {
            global: { 
                plugins: [vuetify],
                stubs: { 
                    CostEditForm: { template: '<div><slot></slot></div>', methods: { success: () => { } } },
                    MonthDatePicker: true 
                }
            },
            props: { cost: null }
        });

        expect(wrapper.findComponent({ name: 'MonthDatePicker' }).exists()).toBe(true);
    });
});