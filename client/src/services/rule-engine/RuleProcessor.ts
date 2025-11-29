/**
 * Abstract base class for all rule processors
 * Implements the Open/Closed Principle - extensible without modification
 */
export abstract class RuleProcessor<TConfig = any> {
  /**
   * Apply the rule transformation to a filename
   * @param filename - The filename to transform (without path)
   * @param config - Rule-specific configuration
   * @returns Transformed filename
   */
  abstract apply(filename: string, config: TConfig): string;

  /**
   * Get the base filename without extension
   * @param filename - Full filename with extension
   * @returns Filename without extension
   */
  protected getBasename(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return filename;
    }
    return filename.substring(0, lastDotIndex);
  }

  /**
   * Get the file extension (including the dot)
   * @param filename - Full filename
   * @returns Extension with dot, or empty string if no extension
   */
  protected getExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return '';
    }
    return filename.substring(lastDotIndex);
  }

  /**
   * Sanitize filename by removing invalid characters
   * Removes: / : * ? " < > |
   * @param filename - Filename to sanitize
   * @returns Sanitized filename
   */
  protected sanitize(filename: string): string {
    // Remove invalid characters
    let sanitized = filename.replace(/[/:*?"<>|]/g, '');

    // Remove leading/trailing spaces and dots
    sanitized = sanitized.trim().replace(/^\.+|\.+$/g, '');

    // If empty after sanitization, return a default name
    if (!sanitized) {
      return 'unnamed';
    }

    return sanitized;
  }

  /**
   * Validate that the filename is not empty after processing
   * @param filename - Filename to validate
   * @returns Valid filename or 'unnamed' if invalid
   */
  protected validateFilename(filename: string): string {
    const trimmed = filename.trim();
    return trimmed.length > 0 ? trimmed : 'unnamed';
  }
}
