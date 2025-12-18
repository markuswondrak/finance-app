import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  toCurrency,
  monthMap,
  displayMonth,
  quaterlyStrings,
  healfyearlyStrings,
  toQuaterlyDueDate,
  toHalfyearlyDueDate,
  toMonth,
  toSelectItems,
  equals,
  monthlyCostToForm,
  baseFormToCost,
  CommonForm
} from '@/components/Utils.js';

describe('Utils.js', () => {
  describe('toCurrency', () => {
    it('should format number with thousands separator and euro symbol', () => {
      expect(toCurrency(1000)).toBe('1.000,00 €');
      expect(toCurrency(1000000)).toBe('1.000.000,00 €');
      expect(toCurrency(500)).toBe('500,00 €');
      expect(toCurrency(0)).toBe('0,00 €');
    });

    it('should handle negative numbers', () => {
      expect(toCurrency(-1000)).toBe('-1.000,00 €');
      expect(toCurrency(-500)).toBe('-500,00 €');
    });

    it('should handle decimal numbers', () => {
      expect(toCurrency(1000.50)).toBe('1.000,50 €');
      expect(toCurrency(999.99)).toBe('999,99 €');
    });
  });

  describe('monthMap', () => {
    it('should contain all 12 German month names', () => {
      expect(monthMap).toHaveLength(12);
      expect(monthMap[0]).toBe('Januar');
      expect(monthMap[11]).toBe('Dezember');
    });
  });

  describe('displayMonth', () => {
    beforeEach(() => {
      // Vitest jsdom environment has window
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should display full month name for desktop', () => {
      const yearMonth = { year: 2023, month: 1 };
      expect(displayMonth(yearMonth)).toBe('Januar / 2023');
    });

    it('should display month number for mobile when responsive is true', () => {
      window.innerWidth = 500;
      const yearMonth = { year: 2023, month: 12 };
      expect(displayMonth(yearMonth, true)).toBe('12 / 2023');
    });

    it('should display full month name when responsive is false', () => {
      window.innerWidth = 500;
      const yearMonth = { year: 2023, month: 6 };
      expect(displayMonth(yearMonth, false)).toBe('Juni / 2023');
    });

    it('should return empty string or custom empty value when yearMonth is null', () => {
      expect(displayMonth(null)).toBe('-');
      expect(displayMonth(null, true, 'N/A')).toBe('N/A');
      expect(displayMonth(undefined)).toBe('-');
    });

    it('should handle all months correctly', () => {
      for (let month = 1; month <= 12; month++) {
        const yearMonth = { year: 2023, month };
        const result = displayMonth(yearMonth, false);
        expect(result).toContain(monthMap[month - 1]);
        expect(result).toContain('2023');
      }
    });
  });

  describe('quaterlyStrings', () => {
    it('should have 3 entries for quarterly periods', () => {
      expect(quaterlyStrings).toHaveLength(3);
    });

    it('should contain correct quarterly month groupings', () => {
      expect(quaterlyStrings[0]).toContain('Januar');
      expect(quaterlyStrings[0]).toContain('April');
      expect(quaterlyStrings[0]).toContain('Juli');
      expect(quaterlyStrings[0]).toContain('Oktober');
    });
  });

  describe('healfyearlyStrings', () => {
    it('should have 6 entries for half-yearly periods', () => {
      expect(healfyearlyStrings).toHaveLength(6);
    });
  });

  describe('toQuaterlyDueDate', () => {
    it('should return correct quarterly string for due date', () => {
      expect(toQuaterlyDueDate(1)).toBe(quaterlyStrings[0]);
      expect(toQuaterlyDueDate(2)).toBe(quaterlyStrings[1]);
      expect(toQuaterlyDueDate(3)).toBe(quaterlyStrings[2]);
    });
  });

  describe('toHalfyearlyDueDate', () => {
    it('should return correct half-yearly string for due date', () => {
      expect(toHalfyearlyDueDate(1)).toBe(healfyearlyStrings[0]);
      expect(toHalfyearlyDueDate(6)).toBe(healfyearlyStrings[5]);
    });
  });

  describe('toMonth', () => {
    it('should return correct month name for month number', () => {
      expect(toMonth(1)).toBe('Januar');
      expect(toMonth(6)).toBe('Juni');
      expect(toMonth(12)).toBe('Dezember');
    });
  });

  describe('toSelectItems', () => {
    it('should convert array to select items with text and value', () => {
      const list = ['Option 1', 'Option 2', 'Option 3'];
      const result = toSelectItems(list);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ text: 'Option 1', value: 0 });
      expect(result[1]).toEqual({ text: 'Option 2', value: 1 });
      expect(result[2]).toEqual({ text: 'Option 3', value: 2 });
    });

    it('should handle empty array', () => {
      expect(toSelectItems([])).toEqual([]);
    });
  });

  describe('equals', () => {
    it('should return true for identical primitive values', () => {
      expect(equals(1, 1)).toBe(true);
      expect(equals('test', 'test')).toBe(true);
      expect(equals(true, true)).toBe(true);
    });

    it('should return true for equal objects', () => {
      const obj1 = { a: 1, b: 2, c: 'test' };
      const obj2 = { a: 1, b: 2, c: 'test' };
      expect(equals(obj1, obj2)).toBe(true);
    });

    it('should return false for objects with different values', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      expect(equals(obj1, obj2)).toBe(false);
    });

    it('should return false for objects with different keys', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, c: 2 };
      expect(equals(obj1, obj2)).toBe(false);
    });

    it('should return false when one object is null', () => {
      expect(equals({ a: 1 }, null)).toBe(false);
      expect(equals(null, { a: 1 })).toBe(false);
    });

    it('should return true when both objects are null', () => {
      expect(equals(null, null)).toBe(true);
    });

    it('should handle objects with different number of keys', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2, c: 3 };
      expect(equals(obj1, obj2)).toBe(false);
    });
  });

  describe('monthlyCostToForm', () => {
    it('should convert cost object to form object with positive amount', () => {
      const cost = {
        id: 1,
        name: 'Salary',
        amount: 3000,
        from: '2023-01',
        to: '2023-12'
      };

      const result = monthlyCostToForm(cost);

      expect(result).toEqual({
        id: 1,
        name: 'Salary',
        amount: 3000,
        incoming: true,
        fromTo: {
          from: '2023-01',
          to: '2023-12'
        }
      });
    });

    it('should convert cost with negative amount and set incoming to false', () => {
      const cost = {
        id: 2,
        name: 'Rent',
        amount: -1000,
        from: '2023-01',
        to: null
      };

      const result = monthlyCostToForm(cost);

      expect(result).toEqual({
        id: 2,
        name: 'Rent',
        amount: 1000,
        incoming: false,
        fromTo: {
          from: '2023-01',
          to: null
        }
      });
    });

    it('should return default form object when cost is null', () => {
      const result = monthlyCostToForm(null);

      expect(result).toEqual({
        id: null,
        name: '',
        amount: 0,
        incoming: false,
        fromTo: {
          from: null,
          to: null
        }
      });
    });

    it('should return default form object when cost is undefined', () => {
      const result = monthlyCostToForm(undefined);

      expect(result).toEqual({
        id: null,
        name: '',
        amount: 0,
        incoming: false,
        fromTo: {
          from: null,
          to: null
        }
      });
    });
  });

  describe('baseFormToCost', () => {
    it('should convert form to cost with positive amount for incoming', () => {
      const form = {
        id: 1,
        name: 'Salary',
        amount: 3000,
        incoming: true
      };

      const result = baseFormToCost(form);

      expect(result).toEqual({
        id: 1,
        name: 'Salary',
        amount: 3000,
        from: null,
        to: null
      });
    });

    it('should convert form to cost with negative amount for outgoing', () => {
      const form = {
        id: 2,
        name: 'Rent',
        amount: 1000,
        incoming: false
      };

      const result = baseFormToCost(form);

      expect(result).toEqual({
        id: 2,
        name: 'Rent',
        amount: -1000,
        from: null,
        to: null
      });
    });

    it('should handle zero amount', () => {
      const form = {
        id: 3,
        name: 'Test',
        amount: 0,
        incoming: false
      };

      const result = baseFormToCost(form);

      expect(result.amount).toBe(0);
    });
  });

  describe('CommonForm mixin', () => {
    const mockCostToForm = vi.fn(cost => cost ? { ...cost } : { id: null, name: '' });
    const mockFormToCost = vi.fn(form => ({ ...form }));
    const mockEndpoint = '/api/test';

    let mixin;

    beforeEach(() => {
      mockCostToForm.mockClear();
      mockFormToCost.mockClear();
      mixin = CommonForm(mockCostToForm, mockFormToCost, mockEndpoint);
    });

    it('should have correct props', () => {
      expect(mixin.props).toEqual(['cost', 'add']);
    });

    it('should initialize data with form from costToForm', () => {
      const cost = { id: 1, name: 'Test' };
      const component = {
        cost,
        costToForm: mockCostToForm
      };

      const data = mixin.data.call(component);

      expect(mockCostToForm).toHaveBeenCalledWith(cost);
      expect(data.form).toEqual(cost);
    });

    it('should have costToForm and formToCost methods', () => {
      expect(mixin.methods.costToForm).toBe(mockCostToForm);
      expect(mixin.methods.formToCost).toBe(mockFormToCost);
    });

    describe('title method', () => {
      it('should return add title when cost is null', () => {
        const component = { cost: null };
        const title = mixin.methods.title.call(component, 'Kosten');
        expect(title).toBe('Kosten hinzufügen');
      });

      it('should return edit title when cost has name', () => {
        const component = { cost: { name: 'Test' } };
        const title = mixin.methods.title.call(component, 'Kosten');
        expect(title).toBe('Kosten ändern');
      });
    });

    describe('successMsg method', () => {
      it('should return add success message when cost is null', () => {
        const component = { cost: null };
        const msgFn = mixin.methods.successMsg.call(component, 'Kosten');
        expect(msgFn('TestKosten')).toBe('Kosten \'TestKosten\' erfolgreich hinzugefügt');
      });

      it('should return edit success message when cost has name', () => {
        const component = { cost: { name: 'Test' } };
        const msgFn = mixin.methods.successMsg.call(component, 'Kosten');
        expect(msgFn('TestKosten')).toBe('Kosten \'TestKosten\' erfolgreich geändert');
      });
    });

    describe('saveCost method', () => {
      beforeEach(() => {
        global.fetch = vi.fn(() => Promise.resolve({ ok: true }));
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('should call fetch with correct parameters', async () => {
        const form = { id: 1, name: 'Test' };
        const convertedCost = { id: 1, name: 'Test', amount: 100 };
        mockFormToCost.mockReturnValueOnce(convertedCost);

        const component = {
          form,
          $refs: {
            editform: {
              success: vi.fn()
            }
          },
          $emit: vi.fn()
        };

        await mixin.methods.saveCost.call(component);

        expect(mockFormToCost).toHaveBeenCalledWith(form);
        expect(global.fetch).toHaveBeenCalledWith(
          mockEndpoint,
          {
            method: 'post',
            body: JSON.stringify(convertedCost),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        expect(component.$refs.editform.success).toHaveBeenCalled();
        expect(component.$emit).toHaveBeenCalledWith('saved');
      });
    });

    describe('changed computed property', () => {
      it('should return false when form equals costToForm result', () => {
        const cost = { id: 1, name: 'Test' };
        const form = { id: 1, name: 'Test' };

        mockCostToForm.mockReturnValue({ id: 1, name: 'Test' });

        const component = {
          form,
          cost,
          costToForm: mockCostToForm
        };

        const result = mixin.computed.changed.call(component);
        expect(result).toBe(false);
      });

      it('should return true when form differs from costToForm result', () => {
        const cost = { id: 1, name: 'Test' };
        const form = { id: 1, name: 'Modified' };

        mockCostToForm.mockReturnValue({ id: 1, name: 'Test' });

        const component = {
          form,
          cost,
          costToForm: mockCostToForm
        };

        const result = mixin.computed.changed.call(component);
        expect(result).toBe(true);
      });
    });
  });
});