import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAuthStore } from '../../stores/authStore';

// Mock the auth store
jest.mock('../../stores/authStore');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Mock Supabase
jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
      getSession: jest.fn(),
    },
  },
}));

// Mock AuthService
jest.mock('../../services/auth', () => ({
  AuthService: {
    getSession: jest.fn(),
    signUp: jest.fn(),
    signIn: jest.fn(),
    signInWithProvider: jest.fn(),
    signOut: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

// Mock toast hook
jest.mock('../useToast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock router
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const mockAuthStore = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: jest.fn(),
  setAuthenticated: jest.fn(),
  setLoading: jest.fn(),
  logout: jest.fn(),
};

describe('useAuth', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue(mockAuthStore as any);
    jest.clearAllMocks();
  });

  it('should return auth state from store', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should have auth methods available', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(typeof result.current.signUp).toBe('function');
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signInWithProvider).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.resetPassword).toBe('function');
  });
});