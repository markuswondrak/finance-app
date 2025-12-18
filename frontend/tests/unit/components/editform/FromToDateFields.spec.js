import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import FromToDateFields from '@/components/editform/FromToDateFields.vue';
import MonthYearDatepicker from '@/components/common/MonthYearDatepicker.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Mock MonthYearDatepicker to avoid deep rendering issues and focus on props
const MonthYearDatepickerStub = {
  template: '<div></div>',
  props: ['label', 'modelValue', 'min', 'max', 'errorMessages']
};

describe('FromToDateFields.vue', () => {
    let vuetify;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
    });

    it('should render two month year date pickers', () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthYearDatepicker: MonthYearDatepickerStub }
            },
            props: {
                modelValue: { from: { year: 2023, month: 1 }, to: { year: 2023, month: 12 } }
            }
        });

        const pickers = wrapper.findAllComponents(MonthYearDatepickerStub);
        expect(pickers).toHaveLength(2);
    });

    it('should pass correct labels to pickers', () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthYearDatepicker: MonthYearDatepickerStub }
            },
            props: {
                modelValue: { from: { year: 2023, month: 1 }, to: { year: 2023, month: 12 } }
            }
        });

        const pickers = wrapper.findAllComponents(MonthYearDatepickerStub);
        expect(pickers.at(0).props().label).toBe('Gültig ab');
        expect(pickers.at(1).props().label).toBe('Gültig bis');
    });

    it('should pass Date objects to pickers based on YearMonth objects', () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthYearDatepicker: MonthYearDatepickerStub }
            },
            props: {
                modelValue: { from: { year: 2023, month: 1 }, to: { year: 2023, month: 12 } }
            }
        });

        const pickers = wrapper.findAllComponents(MonthYearDatepickerStub);
        
        const fromDate = pickers.at(0).props().modelValue;
        expect(fromDate).toBeInstanceOf(Date);
        expect(fromDate.getFullYear()).toBe(2023);
        expect(fromDate.getMonth()).toBe(0); // Jan

        const toDate = pickers.at(1).props().modelValue;
        expect(toDate).toBeInstanceOf(Date);
        expect(toDate.getFullYear()).toBe(2023);
        expect(toDate.getMonth()).toBe(11); // Dec
    });

    it('should calculate validation errors for to-date', async () => {
        const wrapper = mount(FromToDateFields, {
            global: { 
                plugins: [vuetify],
                stubs: { MonthYearDatepicker: MonthYearDatepickerStub }
            },
            props: {
                modelValue: { from: { year: 2023, month: 5 }, to: { year: 2023, month: 1 } }
            }
        });

        const toPicker = wrapper.findAllComponents(MonthYearDatepickerStub).at(1);
        expect(toPicker.props().errorMessages).toContain("'Gültig bis' darf nicht kleiner als 'Gültig ab' sein");
        
        // Update to valid date
        await wrapper.setProps({
            modelValue: { from: { year: 2023, month: 5 }, to: { year: 2023, month: 6 } }
        });
        
        expect(wrapper.findAllComponents(MonthYearDatepickerStub).at(1).props().errorMessages).toHaveLength(0);
    });
});
