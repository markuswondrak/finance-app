import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import MonthDatePicker from '@/components/editform/MonthDatePicker.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('MonthDatePicker.vue', () => {
    let vuetify;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
    });

    it('should render with label', () => {
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                label: 'Test Label',
                modelValue: [2023, 1]
            }
        });

        const textField = wrapper.findComponent({ name: 'VTextField' });
        expect(textField.props().label).toBe('Test Label');
    });

    it('should display formatted date', () => {
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                modelValue: [2023, 1]
            }
        });

        expect(wrapper.vm.displayDate).toBe('Januar / 2023');
    });

    it('should emit update:modelValue event when date selected', () => {
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                modelValue: [2023, 1]
            }
        });

        // Simulate input from VDatePicker (passes Date object or ISO string)
        // VDatePicker usually passes Date object.
        const date = new Date(2023, 1, 15); // Feb 2023
        wrapper.vm.input(date);
        
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        // input converts date to [Year, Month] (1-based)
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([[2023, 2]]);
    });

    it('should handle null input', () => {
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                modelValue: null
            }
        });

        wrapper.vm.input(null);
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([null]);
    });

    it('should validate rules', () => {
        const rule = vi.fn(() => true);
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                modelValue: [2023, 1],
                rules: [rule]
            }
        });

        const date = new Date(2023, 1, 15); // Feb
        wrapper.vm.input(date);
        
        expect(rule).toHaveBeenCalled();
        expect(wrapper.vm.errorMessages).toEqual([]);
    });

    it('should set error messages if validation fails', () => {
        const rule = vi.fn(() => 'Error message');
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                modelValue: [2023, 1],
                rules: [rule]
            }
        });

        const date = new Date(2023, 1, 15);
        wrapper.vm.input(date);
        expect(wrapper.vm.errorMessages).toEqual(['Error message']);
    });

    it('should use min date prop', () => {
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                modelValue: [2023, 1],
                min: [2022, 1]
            }
        });

        // minDate computed property returns Date object now
        expect(wrapper.vm.minDate).toBeInstanceOf(Date);
        expect(wrapper.vm.minDate.getFullYear()).toBe(2022);
        expect(wrapper.vm.minDate.getMonth()).toBe(0); // Jan is 0
    });

    it('should fallback to undefined for min date if not provided', () => {
        const wrapper = mount(MonthDatePicker, {
            global: { plugins: [vuetify] },
            props: {
                modelValue: [2023, 1]
            }
        });

        // The updated component returns undefined if min not provided
        expect(wrapper.vm.minDate).toBeUndefined();
    });
});