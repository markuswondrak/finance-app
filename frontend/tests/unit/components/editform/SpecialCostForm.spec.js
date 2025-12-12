import { shallowMount, createLocalVue } from '@vue/test-utils';
import SpecialCostForm from '@/components/editform/SpecialCostForm.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('SpecialCostForm.vue', () => {
    let vuetify;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        vuetify = new Vuetify();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        global.fetch.mockRestore();
    });

    it('should call success on editform after save', async () => {
        global.fetch.mockResolvedValue({});

        const successSpy = jest.fn();
        const LocalStub = {
            name: 'CostEditForm',
            template: '<div><slot></slot></div>',
            methods: { success: successSpy }
        };

        const wrapper = shallowMount(SpecialCostForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: LocalStub
            },
            propsData: { cost: null }
        });

        wrapper.vm.form.name = 'Special Cost';
        wrapper.vm.form.amount = 1000;
        wrapper.vm.form.dueDate = '2023-10';

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
    });

    it('should render MonthDatePicker', () => {
        const wrapper = shallowMount(SpecialCostForm, {
            vuetify,
            localVue,
            stubs: { CostEditForm: { template: '<div><slot></slot></div>', methods: { success: () => { } } } },
            propsData: { cost: null }
        });

        expect(wrapper.findComponent({ name: 'MonthDatePicker' }).exists()).toBe(true);
    });
});
