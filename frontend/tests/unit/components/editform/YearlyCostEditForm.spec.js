import { shallowMount, createLocalVue } from '@vue/test-utils';
import YearlyCostEditForm from '@/components/editform/YearlyCostEditForm.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('YearlyCostEditForm.vue', () => {
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

        const wrapper = shallowMount(YearlyCostEditForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: LocalStub
            },
            propsData: { cost: null }
        });

        wrapper.vm.form.name = 'Yearly';
        wrapper.vm.form.amount = 1000;
        wrapper.vm.form.month = 1;

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
    });

    it('should initialize logic correctly', () => {
        const wrapper = shallowMount(YearlyCostEditForm, {
            vuetify,
            localVue,
            stubs: { CostEditForm: { template: '<div><slot></slot></div>', methods: { success: () => { } } } },
            propsData: { cost: null }
        });
        expect(wrapper.vm.items).toBeDefined();
        expect(wrapper.vm.items.length).toBe(12);
    });
});
