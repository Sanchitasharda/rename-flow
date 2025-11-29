import { RuleProcessor } from './RuleProcessor';
import { NumberingPlacement } from '../../types/Rule';

export interface NumberingConfig {
  start: number;
  padding: number;
  placement: NumberingPlacement;
}

/**
 * Processor for adding sequential numbering to filenames
 * Supports custom start value, padding, and placement (prefix/suffix)
 */
export class NumberingRuleProcessor extends RuleProcessor<NumberingConfig> {
  private currentIndex: number = 0;

  /**
   * Reset the counter (call this before processing a batch of files)
   */
  reset(): void {
    this.currentIndex = 0;
  }

  apply(filename: string, config: NumberingConfig): string {
    const basename = this.getBasename(filename);
    const extension = this.getExtension(filename);

    const number = config.start + this.currentIndex;
    const paddedNumber = this.padNumber(number, config.padding);

    let newBasename: string;
    if (config.placement === NumberingPlacement.PREFIX) {
      newBasename = paddedNumber + '_' + basename;
    } else {
      newBasename = basename + '_' + paddedNumber;
    }

    this.currentIndex++;

    return this.validateFilename(newBasename) + extension;
  }

  /**
   * Pad a number with leading zeros
   * Example: padNumber(5, 3) => "005"
   */
  private padNumber(num: number, padding: number): string {
    return num.toString().padStart(padding, '0');
  }
}
