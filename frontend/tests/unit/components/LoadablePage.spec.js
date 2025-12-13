import LoadablePage from '@/components/LoadablePage.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('LoadablePage.js mixin', () => {
  describe('data', () => {
    it('should initialize with loaded set to false', () => {
      const data = LoadablePage.data();
      expect(data).toEqual({ loaded: false });
    });
  });

  describe('fetchData method', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should fetch data from URL and set loaded to true', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      global.fetch.mockResolvedValue({
        json: vi.fn(() => Promise.resolve(mockData))
      });

      const component = {
        loaded: false
      };

      const result = await LoadablePage.methods.fetchData.call(component, '/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test');
      expect(result).toEqual(mockData);
      expect(component.loaded).toBe(true);
    });

    it('should handle multiple sequential fetches', async () => {
      const mockData1 = { id: 1, name: 'First' };
      const mockData2 = { id: 2, name: 'Second' };

      global.fetch
        .mockResolvedValueOnce({
          json: vi.fn(() => Promise.resolve(mockData1))
        })
        .mockResolvedValueOnce({
          json: vi.fn(() => Promise.resolve(mockData2))
        });

      const component = {
        loaded: false
      };

      const result1 = await LoadablePage.methods.fetchData.call(component, '/api/first');
      expect(result1).toEqual(mockData1);
      expect(component.loaded).toBe(true);

      const result2 = await LoadablePage.methods.fetchData.call(component, '/api/second');
      expect(result2).toEqual(mockData2);
      expect(component.loaded).toBe(true);
    });

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const component = {
        loaded: false
      };

      await expect(
        LoadablePage.methods.fetchData.call(component, '/api/test')
      ).rejects.toThrow('Network error');

      expect(component.loaded).toBe('error');
    });

    it('should handle JSON parse errors', async () => {
      global.fetch.mockResolvedValue({
        json: vi.fn(() => Promise.reject(new Error('Invalid JSON')))
      });

      const component = {
        loaded: false
      };

      await expect(
        LoadablePage.methods.fetchData.call(component, '/api/test')
      ).rejects.toThrow('Invalid JSON');

      expect(component.loaded).toBe('error');
    });
  });
});