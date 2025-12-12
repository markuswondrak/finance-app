import { shallowMount, createLocalVue } from '@vue/test-utils';
import FromToDateFields from '@/components/editform/FromToDateFields.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('FromToDateFields.vue', () => {
    let vuetify;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        vuetify = new Vuetify();
    });

    it('should render two month date pickers', () => {
        const wrapper = shallowMount(FromToDateFields, {
            vuetify,
            localVue,
            propsData: {
                value: { from: ['2023', '01'], to: ['2023', '12'] }
            }
        });

        const pickers = wrapper.findAllComponents({ name: 'MonthDatePicker' });
        expect(pickers).toHaveLength(2);
    });

    it('should pass correct labels to pickers', () => {
        const wrapper = shallowMount(FromToDateFields, {
            vuetify,
            localVue,
            propsData: {
                value: { from: ['2023', '01'], to: ['2023', '12'] }
            }
        });

        const pickers = wrapper.findAllComponents({ name: 'MonthDatePicker' });
        expect(pickers.at(0).props().label).toBe('Gültig ab');
        expect(pickers.at(1).props().label).toBe('Gültig bis');
    });

    it('should pass value props to pickers', () => {
        const wrapper = shallowMount(FromToDateFields, {
            vuetify,
            localVue,
            propsData: {
                value: { from: ['2023', '01'], to: ['2023', '12'] }
            }
        });

        const pickers = wrapper.findAllComponents({ name: 'MonthDatePicker' });
        expect(pickers.at(0).props().value).toEqual(['2023', '01']);
        expect(pickers.at(1).props().value).toEqual(['2023', '12']);
    });

    it('should have validation rule for to-date', () => {
        const wrapper = shallowMount(FromToDateFields, {
            vuetify,
            localVue,
            propsData: {
                value: { from: ['2023', '01'], to: ['2023', '12'] }
            }
        });

        const toPicker = wrapper.findAllComponents({ name: 'MonthDatePicker' }).at(1);
        expect(toPicker.props().rules).toBeDefined();
        expect(toPicker.props().rules.length).toBeGreaterThan(0);
    });

    it('should validate to-date greater than from-date', () => {
        const wrapper = shallowMount(FromToDateFields, {
            vuetify,
            localVue,
            propsData: {
                value: { from: '2023-05-01', to: '2023-01-01' } // Using date strings for easy comparison in rule logic
            }
        });

        // Access the rule function directly from vm data
        const rule = wrapper.vm.toDateRules[0];

        // Valid case
        expect(rule('2023-06-01')).toBe(true);

        // Invalid case (to < from)
        // Note: The component expects 'from' to be populated for the rule to check against 'd'
        // But wrapper.vm.value.from is passed by reference.
        // The previous propsData initialized it.

        // Redefine wrapper with specific 'from'
        const wrapper2 = shallowMount(FromToDateFields, {
            vuetify,
            localVue,
            propsData: {
                value: { from: '2023-05-01', to: null }
            }
        });

        const rule2 = wrapper2.vm.toDateRules[0];
        expect(rule2('2023-04-01')).toBe("'Gültig bis' darf nicht kleiner als 'Gültig ab' sein");
    });
});
