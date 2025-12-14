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

    it('should apply text-error class if amount is negative', () => {
        const wrapper = mount(CurrentAmount, {
            global: { plugins: [vuetify] },
            props: {
                currentAmount: -50
            }
        });

        const strong = wrapper.find('strong');
        expect(strong.classes()).toContain('text-error');
    });

    describe('Financial Color Coding (US2)', () => {
        it('should apply text-success class for positive amounts', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: 1000
                }
            });

            const strong = wrapper.find('strong');
            expect(strong.classes()).toContain('text-success');
        });

        it('should apply text-error class for negative amounts', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: -500
                }
            });

            const strong = wrapper.find('strong');
            expect(strong.classes()).toContain('text-error');
        });

        it('should apply text-neutral class for zero amounts', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: 0
                }
            });

            const strong = wrapper.find('strong');
            expect(strong.classes()).toContain('text-neutral');
        });

        it('should use surface-bright background for positive amounts', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: 100
                }
            });

            const banner = wrapper.findComponent({ name: 'VBanner' });
            expect(banner.props().color).toBe('surface-bright');
        });

        it('should use surface background for negative amounts', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: -100
                }
            });

            const banner = wrapper.findComponent({ name: 'VBanner' });
            expect(banner.props().color).toBe('surface');
        });
    });

    describe('Snapshots', () => {
        it('should match snapshot with positive amount', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: 5000.50
                }
            });

            expect(wrapper.html()).toMatchSnapshot();
        });

        it('should match snapshot with negative amount', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: -1234.56
                }
            });

            expect(wrapper.html()).toMatchSnapshot();
        });

        it('should match snapshot with zero amount', () => {
            const wrapper = mount(CurrentAmount, {
                global: { plugins: [vuetify] },
                props: {
                    currentAmount: 0
                }
            });

            expect(wrapper.html()).toMatchSnapshot();
        });
    });
});