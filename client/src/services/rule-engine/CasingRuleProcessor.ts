import { RuleProcessor } from './RuleProcessor';
import { CasingType } from '../../types/Rule';

export interface CasingConfig {
  caseType: CasingType;
}

/**
 * Processor for casing transformation rules
 * Supports: snake_case, camelCase, PascalCase, UPPERCASE, lowercase
 */
export class CasingRuleProcessor extends RuleProcessor<CasingConfig> {
  apply(filename: string, config: CasingConfig): string {
    const basename = this.getBasename(filename);
    const extension = this.getExtension(filename);

    const transformedBasename = this.transformCase(basename, config.caseType);

    return this.sanitize(transformedBasename + extension);
  }

  /**
   * Transform text to the specified case type
   */
  private transformCase(text: string, caseType: CasingType): string {
    switch (caseType) {
      case CasingType.SNAKE_CASE:
        return this.toSnakeCase(text);
      case CasingType.CAMEL_CASE:
        return this.toCamelCase(text);
      case CasingType.PASCAL_CASE:
        return this.toPascalCase(text);
      case CasingType.UPPER_CASE:
        return text.toUpperCase();
      case CasingType.LOWER_CASE:
        return text.toLowerCase();
      default:
        return text;
    }
  }

  /**
   * Convert to snake_case
   * Example: "MyFileName" -> "my_file_name"
   */
  private toSnakeCase(text: string): string {
    return text
      // Insert underscore before uppercase letters
      .replace(/([A-Z])/g, '_$1')
      // Replace spaces and hyphens with underscores
      .replace(/[\s-]+/g, '_')
      // Remove multiple consecutive underscores
      .replace(/_+/g, '_')
      // Convert to lowercase
      .toLowerCase()
      // Remove leading underscore
      .replace(/^_/, '');
  }

  /**
   * Convert to camelCase
   * Example: "my_file_name" -> "myFileName"
   */
  private toCamelCase(text: string): string {
    return text
      // Split by underscores, hyphens, and spaces
      .split(/[_\s-]+/)
      // Capitalize first letter of each word except the first
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

  /**
   * Convert to PascalCase
   * Example: "my_file_name" -> "MyFileName"
   */
  private toPascalCase(text: string): string {
    return text
      // Split by underscores, hyphens, and spaces
      .split(/[_\s-]+/)
      // Capitalize first letter of each word
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }
}
