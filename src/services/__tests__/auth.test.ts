import { AuthService } from '../auth';

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(AuthService.validateEmail('test@example.com')).toBe(true);
      expect(AuthService.validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(AuthService.validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(AuthService.validateEmail('invalid-email')).toBe(false);
      expect(AuthService.validateEmail('test@')).toBe(false);
      expect(AuthService.validateEmail('@example.com')).toBe(false);
      expect(AuthService.validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = AuthService.validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = AuthService.validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should require minimum length', () => {
      const result = AuthService.validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should require uppercase letter', () => {
      const result = AuthService.validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should require lowercase letter', () => {
      const result = AuthService.validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should require number', () => {
      const result = AuthService.validatePassword('NoNumbers!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should require special character', () => {
      const result = AuthService.validatePassword('NoSpecial123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      const result = AuthService.validateUsername('validuser123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short usernames', () => {
      const result = AuthService.validateUsername('ab');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username must be at least 3 characters long');
    });

    it('should reject long usernames', () => {
      const result = AuthService.validateUsername('a'.repeat(21));
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username must be no more than 20 characters long');
    });

    it('should reject usernames with invalid characters', () => {
      const result = AuthService.validateUsername('user@name');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username can only contain letters, numbers, and underscores');
    });
  });
});