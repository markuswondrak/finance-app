import { shallowMount, createLocalVue } from '@vue/test-utils';
import QuaterlyCostEditForm from '@/components/editform/QuaterlyCostEditForm.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('QuaterlyCostEditForm.vue', () => {
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

        const wrapper = shallowMount(QuaterlyCostEditForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: LocalStub
            },
            propsData: { cost: null }
        });

        wrapper.vm.form.name = 'Test Cost';
        wrapper.vm.form.amount = 100;
        wrapper.vm.form.dueMonth = 1;

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
    });

    it('should initialize logic correctly', () => {
        const wrapper = shallowMount(QuaterlyCostEditForm, {
            vuetify,
            localVue,
            stubs: { CostEditForm: { template: '<div><slot></slot></div>', methods: { success: () => { } } } },
            propsData: { cost: null }
        });
        // Check if items are loaded (quaterlyStrings)
        expect(wrapper.vm.items).toBeDefined();
        expect(wrapper.vm.items.length).toBeGreaterThan(0);
    });
});
