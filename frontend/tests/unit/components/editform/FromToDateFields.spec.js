import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FromToDateFields from '@/components/editform/FromToDateFields.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Mock MonthDatePicker to avoid deep rendering issues and focus on props
const MonthDatePickerStub = {
  template: '<div></div>',
  props: ['label', 'modelValue', 'rules', 'min', 'max']
};

describe('FromToDateFields.vue', () => {
    let vuetify;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
    });

    it('should render two month date pickers', () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthDatePicker: MonthDatePickerStub }
            },
            props: {
                modelValue: { from: [2023, 1], to: [2023, 12] }
            }
        });

        const pickers = wrapper.findAllComponents(MonthDatePickerStub);
        expect(pickers).toHaveLength(2);
    });

    it('should pass correct labels to pickers', () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthDatePicker: MonthDatePickerStub }
            },
            props: {
                modelValue: { from: [2023, 1], to: [2023, 12] }
            }
        });

        const pickers = wrapper.findAllComponents(MonthDatePickerStub);
        expect(pickers.at(0).props().label).toBe('Gültig ab');
        expect(pickers.at(1).props().label).toBe('Gültig bis');
    });

    it('should pass modelValue props to pickers', () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthDatePicker: MonthDatePickerStub }
            },
            props: {
                modelValue: { from: [2023, 1], to: [2023, 12] }
            }
        });

        const pickers = wrapper.findAllComponents(MonthDatePickerStub);
        expect(pickers.at(0).props().modelValue).toEqual([2023, 1]);
        expect(pickers.at(1).props().modelValue).toEqual([2023, 12]);
    });

    it('should have validation rule for to-date', () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthDatePicker: MonthDatePickerStub }
            },
            props: {
                modelValue: { from: [2023, 1], to: [2023, 12] }
            }
        });

        const toPicker = wrapper.findAllComponents(MonthDatePickerStub).at(1);
        expect(toPicker.props().rules).toBeDefined();
        expect(toPicker.props().rules.length).toBeGreaterThan(0);
    });

    it('should validate to-date greater than from-date', () => {
        // Validation logic expects from to be [y, m]
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthDatePicker: MonthDatePickerStub }
            },
            props: {
                modelValue: { from: [2023, 5], to: null }
            }
        });

        // Access the rule function directly from vm data
        const rule = wrapper.vm.toDateRules[0];

        // Valid case: d is YYYY-MM string (as passed from MonthDatePicker)
        expect(rule('2023-06')).toBe(true);

        // Invalid case (to < from)
        expect(rule('2023-04')).toBe("'Gültig bis' darf nicht kleiner als 'Gültig ab' sein");
    });
});