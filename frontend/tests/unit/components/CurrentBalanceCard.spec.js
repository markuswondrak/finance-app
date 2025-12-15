import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CurrentBalanceCard from '@/components/dashboard/CurrentBalanceCard.vue';

// Mock components
const VCardStub = { template: '<div class="v-card" @click="$emit(\'click\')"><slot /></div>' };
const VCardTextStub = { template: '<div class="v-card-text"><slot /></div>' };
const VIconStub = { template: '<i class="v-icon"></i>' };
const BalanceEditModalStub = { template: '<div></div>', props: ['modelValue', 'currentAmount'] };

describe('CurrentBalanceCard.vue', () => {
  const globalOptions = {
      stubs: {
          VCard: VCardStub,
          VCardText: VCardTextStub,
          VIcon: VIconStub,
          BalanceEditModal: BalanceEditModalStub
      }
  };

  it('renders the title "Aktueller Kontostand"', () => {
    const wrapper = mount(CurrentBalanceCard, {
      props: {
        amount: 1000,
      },
      global: globalOptions
    });
    expect(wrapper.text()).toContain('Aktueller Kontostand');
  });

  it('displays the amount passed via props', () => {
    const wrapper = mount(CurrentBalanceCard, {
      props: {
        amount: 5000,
      },
      global: globalOptions
    });
    // Check for formatted currency string since logic is in computed property
    // But Intl formatting might vary in Node environment.
    // 5000 formatted is roughly "5.000 €" or similar.
    // Let's check for "5.000" or just trust it contains digits.
    // Actually, environment is jsdom.
    
    // We can also check if formattedAmount computed property is correct if we want strictly unit test logic.
    expect(wrapper.vm.formattedAmount).toContain('5.000');
  });

  it('opens the modal when clicked', async () => {
    const wrapper = mount(CurrentBalanceCard, {
      props: {
        amount: 1000,
      },
      global: globalOptions
    });

    await wrapper.find('.v-card').trigger('click');
    expect(wrapper.vm.isModalOpen).toBe(true);
  });
});