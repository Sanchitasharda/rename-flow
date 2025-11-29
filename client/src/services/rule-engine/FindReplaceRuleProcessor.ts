import { RuleProcessor } from './RuleProcessor';

export interface FindReplaceConfig {
  find: string;
  replace: string;
  caseSensitive: boolean;
  replaceAll: boolean;
}

/**
 * Processor for find and replace operations on filenames
 * Supports case-sensitive/insensitive search and replace all occurrences
 */
export class FindReplaceRuleProcessor extends RuleProcessor<FindReplaceConfig> {
  apply(filename: string, config: FindReplaceConfig): string {
    if (!config.find || config.find === '') {
      return filename;
    }

    const basename = this.getBasename(filename);
    const extension = this.getExtension(filename);

    let newBasename: string;

    if (config.replaceAll) {
      const flags = config.caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(this.escapeRegex(config.find), flags);
      newBasename = basename.replace(regex, config.replace);
    } else {
      if (config.caseSensitive) {
        newBasename = basename.replace(config.find, config.replace);
      } else {
        const index = basename.toLowerCase().indexOf(config.find.toLowerCase());
        if (index !== -1) {
          newBasename =
            basename.substring(0, index) +
            config.replace +
            basename.substring(index + config.find.length);
        } else {
          newBasename = basename;
        }
      }
    }

    // Validate that we didn't create an empty filename
    const sanitized = this.sanitize(newBasename);
    return this.validateFilename(sanitized) + extension;
  }

  /**
   * Escape special regex characters in the find string
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
