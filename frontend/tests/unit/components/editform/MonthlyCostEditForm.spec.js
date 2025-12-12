import { shallowMount, createLocalVue } from '@vue/test-utils';
import MonthlyCostEditForm from '@/components/editform/MonthlyCostEditForm.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('MonthlyCostEditForm.vue', () => {
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

    const CostEditFormStub = {
        name: 'CostEditForm',
        template: '<div><slot></slot></div>',
        methods: {
            success: jest.fn()
        }
    };

    it('should render correct fields', () => {
        const wrapper = shallowMount(MonthlyCostEditForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: CostEditFormStub
            },
            propsData: {
                cost: null
            }
        });

        expect(wrapper.findComponent({ name: 'name-text-field' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'currency-input' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'incoming-select' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'from-to-date-fields' }).exists()).toBe(true);
    });

    it('should initialize with empty data when no cost provided', () => {
        const wrapper = shallowMount(MonthlyCostEditForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: CostEditFormStub
            },
            propsData: {
                cost: null
            }
        });

        expect(wrapper.vm.form.name).toBe("");
        expect(wrapper.vm.form.amount).toBe(0);
        expect(wrapper.vm.form.incoming).toBe(false);
        expect(wrapper.vm.form.fromTo.from).toBeNull();
    });

    it('should initialize with cost data', () => {
        const cost = {
            id: 1,
            name: 'Salary',
            amount: 2000,
            from: '2023-01',
            to: null
        };

        const wrapper = shallowMount(MonthlyCostEditForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: CostEditFormStub
            },
            propsData: {
                cost
            }
        });

        expect(wrapper.vm.form.name).toBe('Salary');
        expect(wrapper.vm.form.amount).toBe(2000);
        expect(wrapper.vm.form.incoming).toBe(true);
        expect(wrapper.vm.form.fromTo.from).toBe('2023-01');
    });

    it('should save cost to API', async () => {
        global.fetch.mockResolvedValue({});

        const wrapper = shallowMount(MonthlyCostEditForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: CostEditFormStub
            },
            propsData: {
                cost: null
            }
        });

        wrapper.vm.form.name = 'New Cost';
        wrapper.vm.form.amount = 100;

        // Trigger save via the wrapper method directly or emitting from stub
        // The CostEditForm emits 'save' which calls 'saveCost'
        await wrapper.findComponent(CostEditFormStub).vm.$emit('save');

        expect(global.fetch).toHaveBeenCalledWith('/api/costs/monthly', expect.objectContaining({
            method: 'post',
            body: expect.stringContaining('"name":"New Cost"')
        }));
    });

    it('should call success on editform after save', async () => {
        global.fetch.mockResolvedValue({});

        const successSpy = jest.fn();
        const LocalStub = {
            name: 'CostEditForm',
            template: '<div><slot></slot></div>',
            methods: { success: successSpy }
        };

        const wrapper = shallowMount(MonthlyCostEditForm, {
            vuetify,
            localVue,
            stubs: {
                CostEditForm: LocalStub
            },
            propsData: { cost: null }
        });

        await wrapper.vm.saveCost();

        expect(successSpy).toHaveBeenCalled();
    });
});
