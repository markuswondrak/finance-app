import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TableActionBar from './TableActionBar.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

describe('TableActionBar.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(TableActionBar, {
      global: {
        plugins: [vuetify],
      },
      props: {
        search: '',
        date: null
      }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true); // Search field
  });

  it('emits update:search event when search input changes', async () => {
    const wrapper = mount(TableActionBar, {
      global: {
        plugins: [vuetify],
      },
      props: {
        search: '',
        date: null
      }
    });

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('test search');
    
    expect(wrapper.emitted('update:search')).toBeTruthy();
    expect(wrapper.emitted('update:search')[0]).toEqual(['test search']);
  });

  it('renders slot content', () => {
    const wrapper = mount(TableActionBar, {
      global: {
        plugins: [vuetify],
      },
      slots: {
        action: '<button class="test-btn">Add New</button>'
      }
    });

    expect(wrapper.find('.test-btn').exists()).toBe(true);
  });
});
