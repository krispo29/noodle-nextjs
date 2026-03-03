/**
 * Password utilities using bcrypt
 * Provides secure password hashing and comparison
 */
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return hashed;
}

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - Plain text password to check
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match
 */
export async function verifyPassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid and any error message
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  // OWASP recommended minimum: 12 characters
  if (password.length < 12) {
    return { isValid: false, error: 'Password must be at least 12 characters' };
  }
  
  // Check for at least one uppercase, one lowercase, one number, and one special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUppercase) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowercase) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumber) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  if (!hasSpecial) {
    return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*())' };
  }
  
  return { isValid: true };
}
