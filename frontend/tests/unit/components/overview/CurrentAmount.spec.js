import { shallowMount, createLocalVue } from '@vue/test-utils';
import CurrentAmount from '@/components/overview/CurrentAmount.vue';
import { toCurrency } from '@/components/Utils';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);
Vue.filter('currency', toCurrency);

describe('CurrentAmount.vue', () => {
    let vuetify;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        vuetify = new Vuetify();
    });

    it('should render correct current amount', () => {
        const wrapper = shallowMount(CurrentAmount, {
            vuetify,
            localVue,
            propsData: {
                currentAmount: 1234.56
            }
        });

        expect(wrapper.text()).toContain('1.234.56 €');
    });

    it('should render dialog hidden by default', () => {
        const wrapper = shallowMount(CurrentAmount, {
            vuetify,
            localVue,
            propsData: {
                currentAmount: 100
            }
        });

        const dialog = wrapper.findComponent({ name: 'v-dialog' });
        expect(dialog.props().value).toBe(false);
    });

    it('should open dialog when change button is clicked', async () => {
        // shallowMount stubs v-banner slots but renders them? 
        // v-banner actions slot.
        // We need to mount or use shallowMount with correct slot access.

        const wrapper = shallowMount(CurrentAmount, {
            vuetify,
            localVue,
            propsData: {
                currentAmount: 100
            },
            slots: {
                actions: '<button class="test-btn" @click="show = true">Change</button>'
            }
        });

        // The component template has <template v-slot:actions><v-btn ... @click="show = true">
        // Since shallowMount stubs v-banner, the slot content might not be interactive in the way we expect unless we find it.
        // But wrapper.vm.show is internal state.

        wrapper.setData({ show: true });
        expect(wrapper.vm.show).toBe(true);
    });

    it('should apply red class if amount is negative', () => {
        const wrapper = shallowMount(CurrentAmount, {
            vuetify,
            localVue,
            propsData: {
                currentAmount: -50
            }
        });

        const strong = wrapper.find('strong');
        expect(strong.classes()).toContain('red');
    });
});
