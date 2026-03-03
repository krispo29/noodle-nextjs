/**
 * Input sanitization utilities
 * Prevents XSS and injection attacks
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes dangerous tags and attributes
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove embed tags
    .replace(/<embed\b[^<]*>/gi, '')
    // Remove on* event handlers
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs (could be used for XSS)
    .replace(/data:/gi, '');
}

/**
 * Sanitize string input - basic cleaning
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 10000); // Limit length
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(input: string): string {
  if (!input) return '';
  
  // Keep only digits, spaces, dashes, and plus sign
  return input.replace(/[^\d\s\-+]/g, '');
}

/**
 * Sanitize email
 */
export function sanitizeEmail(input: string): string {
  if (!input) return '';
  
  // Basic email sanitization - lowercase and trim
  return input.toLowerCase().trim();
}

/**
 * Sanitize order notes (allows some formatting but removes dangerous content)
 */
export function sanitizeNotes(input: string | null | undefined): string {
  if (!input) return '';
  
  return sanitizeHtml(input).substring(0, 1000);
}

/**
 * Validate and sanitize UUID
 */
export function isValidUUID(input: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input);
}
