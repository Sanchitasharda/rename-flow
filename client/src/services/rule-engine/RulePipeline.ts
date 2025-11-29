import { Rule } from '../../types/Rule';
import { RuleFactory } from './RuleFactory';
import { NumberingRuleProcessor } from './NumberingRuleProcessor';

/**
 * Pipeline for processing files through multiple rules sequentially
 * Applies rules in order and handles edge cases
 */
export class RulePipeline {
  /**
   * Apply all enabled rules to a filename in sequence
   * @param filename - Original filename
   * @param rules - Array of rules to apply
   * @returns Transformed filename
   */
  static applyRules(filename: string, rules: Rule[]): string {
    // Filter only enabled rules
    const enabledRules = rules.filter((rule) => rule.enabled);

    if (enabledRules.length === 0) {
      return filename;
    }

    let result = filename;

    // Reset numbering processors before processing
    enabledRules.forEach((rule) => {
      const processor = RuleFactory.createProcessor(rule);
      if (processor instanceof NumberingRuleProcessor) {
        processor.reset();
      }
    });

    // Apply each rule sequentially
    for (const rule of enabledRules) {
      try {
        const processor = RuleFactory.createProcessor(rule);
        const config = RuleFactory.getConfig(rule);
        result = processor.apply(result, config);
      } catch (error) {
        console.error(`Error applying rule ${rule.id}:`, error);
        // Continue with next rule even if one fails
      }
    }

    return result;
  }

  /**
   * Apply rules to multiple files
   * Handles numbering rules correctly across batches
   * @param filenames - Array of filenames to process
   * @param rules - Array of rules to apply
   * @returns Array of transformed filenames
   */
  static applyRulesToBatch(filenames: string[], rules: Rule[]): string[] {
    const enabledRules = rules.filter((rule) => rule.enabled);

    if (enabledRules.length === 0) {
      return filenames;
    }

    // Create processors once for the entire batch
    const processors = enabledRules.map((rule) => ({
      processor: RuleFactory.createProcessor(rule),
      config: RuleFactory.getConfig(rule),
    }));

    // Reset all numbering processors
    processors.forEach(({ processor }) => {
      if (processor instanceof NumberingRuleProcessor) {
        processor.reset();
      }
    });

    // Process each file through the pipeline
    return filenames.map((filename) => {
      let result = filename;

      for (const { processor, config } of processors) {
        try {
          result = processor.apply(result, config);
        } catch (error) {
          console.error(`Error processing ${filename}:`, error);
          // Continue processing
        }
      }

      return result;
    });
  }
}
