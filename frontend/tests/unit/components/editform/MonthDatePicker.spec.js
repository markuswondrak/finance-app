import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import MonthDatePicker from '@/components/editform/MonthDatePicker.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('MonthDatePicker.vue', () => {
    let vuetify;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        vuetify = new Vuetify();
    });

    it('should render with label', () => {
        const wrapper = mount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                label: 'Test Label',
                value: ['2023', '01']
            }
        });

        const textField = wrapper.findComponent({ name: 'v-text-field' });
        expect(textField.props().label).toBe('Test Label');
    });

    it('should display formatted date', () => {
        const wrapper = shallowMount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                value: ['2023', '01']
            }
        });

        expect(wrapper.vm.displayDate).toBe('Januar / 2023');
    });

    it('should emit input event when date selected', () => {
        const wrapper = shallowMount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                value: ['2023', '01']
            }
        });

        wrapper.vm.input('2023-02');
        expect(wrapper.emitted().input).toBeTruthy();
        expect(wrapper.emitted().input[0]).toEqual([['2023', '02']]);
    });

    it('should handle null input', () => {
        const wrapper = shallowMount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                value: null
            }
        });

        wrapper.vm.input(null);
        expect(wrapper.emitted().input[0]).toEqual([null]);
    });

    it('should validate rules', () => {
        const rule = jest.fn(() => true);
        const wrapper = shallowMount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                value: ['2023', '01'],
                rules: [rule]
            }
        });

        wrapper.vm.input('2023-02');
        expect(rule).toHaveBeenCalled();
        expect(wrapper.vm.errorMessages).toEqual([]);
    });

    it('should set error messages if validation fails', () => {
        const rule = jest.fn(() => 'Error message');
        const wrapper = shallowMount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                value: ['2023', '01'],
                rules: [rule]
            }
        });

        wrapper.vm.input('2023-02');
        expect(wrapper.vm.errorMessages).toEqual(['Error message']);
    });

    it('should use min date prop', () => {
        const wrapper = shallowMount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                value: ['2023', '01'],
                min: '2022-01'
            }
        });

        expect(wrapper.vm.minDate).toBe('2022-01');
    });

    it('should fallback to now for min date if not provided', () => {
        const wrapper = shallowMount(MonthDatePicker, {
            vuetify,
            localVue,
            propsData: {
                value: ['2023', '01']
            }
        });

        const now = new Date();
        const expected = `${now.getFullYear()}-${now.getMonth() + 1}`;
        expect(wrapper.vm.minDate).toBe(expected);
    });
});
