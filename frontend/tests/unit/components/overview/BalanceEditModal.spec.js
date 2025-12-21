import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import BalanceEditModal from '@/components/overview/BalanceEditModal.vue';
import { userService } from '@/services/user';

// Mock the userService
vi.mock('@/services/user', () => ({
  userService: {
    updateCurrentAmount: vi.fn(),
  },
}));

// Mock components
const VDialogStub = { template: '<div><slot /></div>', props: ['modelValue'] };
const VCardStub = { template: '<div><slot /></div>' };
const VCardTitleStub = { template: '<div><slot /></div>' };
const VCardTextStub = { template: '<div><slot /></div>' };
const VTextFieldStub = { 
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @keyup.enter="$emit(\'keyup.enter\')" />', 
    props: ['modelValue', 'error-messages'],
    emits: ['update:modelValue', 'keyup.enter']
};
const VCardActionsStub = { template: '<div><slot /></div>' };
const VSpacerStub = { template: '<div></div>' };
const VBtnStub = { template: '<button @click="$emit(\'click\')"><slot /></button>' };

describe('BalanceEditModal.vue', () => {
  const globalOptions = {
      stubs: {
          VDialog: VDialogStub,
          VCard: VCardStub,
          VCardTitle: VCardTitleStub,
          VCardText: VCardTextStub,
          VTextField: VTextFieldStub,
          VCardActions: VCardActionsStub,
          VSpacer: VSpacerStub,
          VBtn: VBtnStub
      }
  };

  it('renders correctly when visible', () => {
    const wrapper = mount(BalanceEditModal, {
      props: {
        modelValue: true,
        currentAmount: 1000,
      },
      global: globalOptions
    });
    
    expect(wrapper.find('input').element.value).toBe('1000');
  });

  it('emits update:modelValue(false) when cancelled', async () => {
    const wrapper = mount(BalanceEditModal, {
      props: {
        modelValue: true,
        currentAmount: 1000,
      },
      global: globalOptions
    });

    const buttons = wrapper.findAll('button');
    // Assuming Cancel is first button
    await buttons[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
  });

  it('calls userService.updateCurrentAmount and emits saved when saved', async () => {
    userService.updateCurrentAmount.mockResolvedValue({ amount: 2000 });
    
    const wrapper = mount(BalanceEditModal, {
      props: {
        modelValue: true,
        currentAmount: 1000,
      },
      global: globalOptions
    });

    // Simulate input change
    await wrapper.find('input').setValue('2000');
    
    // Click save (second button)
    const buttons = wrapper.findAll('button');
    await buttons[1].trigger('click');

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(userService.updateCurrentAmount).toHaveBeenCalledWith(2000);
    expect(wrapper.emitted('saved')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
  });
});