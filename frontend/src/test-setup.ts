import '@testing-library/jest-dom';

// Mock Firebase auth — we don't need real Firebase in component tests
vi.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  googleProvider: {},
  initializeApp: vi.fn(),
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

// Mock axios — not installed as a frontend dependency but used by api.client.ts
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn().mockResolvedValue({ data: {} }),
      post: vi.fn().mockResolvedValue({ data: {} }),
      put: vi.fn().mockResolvedValue({ data: {} }),
      delete: vi.fn().mockResolvedValue({ data: {} }),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

// Mock the Vite env import
vi.stubGlobal('import.meta', {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000/api/v1',
    DEV: true,
  },
});
