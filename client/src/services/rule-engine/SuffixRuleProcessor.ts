import { RuleProcessor } from './RuleProcessor';

export interface SuffixConfig {
  text: string;
}

/**
 * Processor for adding a suffix to filenames
 * Adds text after the filename but before the extension
 */
export class SuffixRuleProcessor extends RuleProcessor<SuffixConfig> {
  apply(filename: string, config: SuffixConfig): string {
    if (!config.text || config.text.trim() === '') {
      return filename;
    }

    const basename = this.getBasename(filename);
    const extension = this.getExtension(filename);

    const sanitizedSuffix = this.sanitize(config.text);
    const newBasename = basename + sanitizedSuffix;

    return this.validateFilename(newBasename) + extension;
  }
}
