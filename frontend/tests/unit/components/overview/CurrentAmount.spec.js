import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CurrentAmount from '@/components/overview/CurrentAmount.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('CurrentAmount.vue', () => {
    let vuetify;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
    });

    it('should render correct current amount', () => {
        const wrapper = mount(CurrentAmount, {
            global: { plugins: [vuetify] },
            props: {
                currentAmount: 1234.56
            }
        });

        expect(wrapper.text()).toContain('1.234.56 €');
    });

    it('should render dialog hidden by default', () => {
        const wrapper = mount(CurrentAmount, {
            global: { plugins: [vuetify] },
            props: {
                currentAmount: 100
            }
        });

        const dialog = wrapper.findComponent({ name: 'VDialog' });
        expect(dialog.props().modelValue).toBe(false);
    });

    it('should open dialog when change button is clicked', async () => {
        const wrapper = mount(CurrentAmount, {
            global: { plugins: [vuetify] },
            props: {
                currentAmount: 100
            }
        });

        const button = wrapper.find('button'); // First button in banner actions
        await button.trigger('click');

        expect(wrapper.vm.show).toBe(true);
    });

    it('should apply red class if amount is negative', () => {
        const wrapper = mount(CurrentAmount, {
            global: { plugins: [vuetify] },
            props: {
                currentAmount: -50
            }
        });

        const strong = wrapper.find('strong');
        expect(strong.classes()).toContain('red');
    });
});