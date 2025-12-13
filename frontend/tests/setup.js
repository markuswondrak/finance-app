// frontend/tests/setup.js
import { beforeEach, vi } from 'vitest';

// Mock ResizeObserver - must be a proper class for Vuetify components
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver - some Vuetify components use this too
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock;

beforeEach(() => {
  // Mock visualViewport which is not available in JSDOM
  if (typeof global.visualViewport === 'undefined') {
    global.visualViewport = {
      width: 1920,
      height: 1080,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  }
});