import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import IncomingSelect from '@/components/editform/IncomingSelect.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe('IncomingSelect.vue', () => {
    let vuetify;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
    });

    it('renders 4 options', () => {
        const wrapper = mount(IncomingSelect, {
            global: { plugins: [vuetify] },
            props: { modelValue: 'expense' }
        });

        // Find buttons. Vuetify v-btn might be inside v-btn-toggle
        const buttons = wrapper.findAllComponents({ name: 'VBtn' });
        expect(buttons.length).toBe(4);
        expect(buttons[0].text()).toContain('Ausgabe');
        expect(buttons[1].text()).toContain('Einnahme');
        expect(buttons[2].text()).toContain('Sparen');
        expect(buttons[3].text()).toContain('Entnahme');
    });

    it('emits investment when Investment clicked', async () => {
        const wrapper = mount(IncomingSelect, {
            global: { plugins: [vuetify] },
            props: { modelValue: 'expense' }
        });

        const buttons = wrapper.findAllComponents({ name: 'VBtn' });
        await buttons[3].trigger('click');

        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['wealth_extraction']);
    });

    it('emits income when Income clicked', async () => {
        const wrapper = mount(IncomingSelect, {
            global: { plugins: [vuetify] },
            props: { modelValue: 'expense' }
        });

        const buttons = wrapper.findAllComponents({ name: 'VBtn' });
        await buttons[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['income']);
    });

    it('emits saving when Saving clicked', async () => {
        const wrapper = mount(IncomingSelect, {
            global: { plugins: [vuetify] },
            props: { modelValue: 'expense' }
        });

        const buttons = wrapper.findAllComponents({ name: 'VBtn' });
        await buttons[2].trigger('click');

        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['saving']);
    });
});