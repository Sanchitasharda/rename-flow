import { getFilenameWithoutExtension, getFileExtension } from './fileHelpers';

/**
 * Invalid characters for Windows and Unix filesystems
 * Windows: \ / : * ? " < > |
 * Unix: /
 * We'll be strict and remove all potentially problematic characters
 */
const INVALID_FILENAME_CHARS = /[<>:"\/\\|?*\x00-\x1F]/g;

/**
 * Reserved Windows filenames
 */
const RESERVED_NAMES = [
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
];

/**
 * Sanitize a filename by removing invalid characters
 * @param filename - Original filename
 * @param replacement - Character to replace invalid chars with (default: '_')
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string, replacement: string = '_'): string {
  if (!filename || filename.trim() === '') {
    return 'unnamed';
  }

  // Split into name and extension
  const nameWithoutExt = getFilenameWithoutExtension(filename);
  const extension = getFileExtension(filename);

  // Remove invalid characters
  let sanitized = nameWithoutExt.replace(INVALID_FILENAME_CHARS, replacement);

  // Remove leading/trailing dots and spaces
  sanitized = sanitized.trim().replace(/^\.+|\.+$/g, '');

  // Handle multiple consecutive replacements (e.g., "___" -> "_")
  if (replacement) {
    const multipleReplacements = new RegExp(`${escapeRegExp(replacement)}{2,}`, 'g');
    sanitized = sanitized.replace(multipleReplacements, replacement);
  }

  // Remove leading/trailing replacement characters
  if (replacement) {
    const leadingTrailing = new RegExp(`^${escapeRegExp(replacement)}+|${escapeRegExp(replacement)}+$`, 'g');
    sanitized = sanitized.replace(leadingTrailing, '');
  }

  // Check for reserved names (case-insensitive)
  const upperName = sanitized.toUpperCase();
  if (RESERVED_NAMES.includes(upperName)) {
    sanitized = `${sanitized}_file`;
  }

  // If name is empty after sanitization, use default
  if (!sanitized || sanitized.trim() === '') {
    sanitized = 'unnamed';
  }

  // Limit filename length (255 is common max, leave room for extension)
  const maxNameLength = 200;
  if (sanitized.length > maxNameLength) {
    sanitized = sanitized.substring(0, maxNameLength);
  }

  return sanitized + extension;
}

/**
 * Check if a filename contains invalid characters
 * @param filename - Filename to check
 * @returns True if filename contains invalid characters
 */
export function hasInvalidCharacters(filename: string): boolean {
  return INVALID_FILENAME_CHARS.test(filename);
}

/**
 * Get list of invalid characters in a filename
 * @param filename - Filename to check
 * @returns Array of invalid characters found
 */
export function getInvalidCharacters(filename: string): string[] {
  const matches = filename.match(INVALID_FILENAME_CHARS);
  if (!matches) return [];

  // Return unique characters
  return [...new Set(matches)];
}

/**
 * Escape special regex characters for use in RegExp
 * @param string - String to escape
 * @returns Escaped string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitize a batch of filenames and detect duplicates
 * @param filenames - Array of filenames to sanitize
 * @returns Array of sanitized filenames with conflict resolution
 */
export function sanitizeFilenames(filenames: string[]): string[] {
  const sanitized = filenames.map(name => sanitizeFilename(name));

  // Track counts for duplicate handling
  const counts = new Map<string, number>();

  return sanitized.map(name => {
    const lowerName = name.toLowerCase();
    const count = counts.get(lowerName) || 0;
    counts.set(lowerName, count + 1);

    if (count > 0) {
      // Duplicate found, append counter
      const nameWithoutExt = getFilenameWithoutExtension(name);
      const extension = getFileExtension(name);
      return `${nameWithoutExt}_${count}${extension}`;
    }

    return name;
  });
}
