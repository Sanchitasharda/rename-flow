import { Rule, RuleType } from '../../types/Rule';
import { RuleProcessor } from './RuleProcessor';
import { CasingRuleProcessor } from './CasingRuleProcessor';
import { PrefixRuleProcessor } from './PrefixRuleProcessor';
import { SuffixRuleProcessor } from './SuffixRuleProcessor';
import { NumberingRuleProcessor } from './NumberingRuleProcessor';
import { FindReplaceRuleProcessor } from './FindReplaceRuleProcessor';

/**
 * Factory for creating rule processors
 * Implements the Factory Pattern and Dependency Inversion Principle
 */
export class RuleFactory {
  /**
   * Create a processor instance for the given rule
   * @param rule - The rule configuration
   * @returns Corresponding processor instance
   * @throws Error if rule type is unknown
   */
  static createProcessor(rule: Rule): RuleProcessor {
    switch (rule.type) {
      case RuleType.CASING:
        return new CasingRuleProcessor();

      case RuleType.PREFIX:
        return new PrefixRuleProcessor();

      case RuleType.SUFFIX:
        return new SuffixRuleProcessor();

      case RuleType.NUMBERING:
        return new NumberingRuleProcessor();

      case RuleType.FIND_REPLACE:
        return new FindReplaceRuleProcessor();

      default:
        throw new Error(`Unknown rule type: ${(rule as any).type}`);
    }
  }

  /**
   * Get the configuration object for a rule
   * Extracts the rule-specific config based on type
   */
  static getConfig(rule: Rule): any {
    return rule.config;
  }
}
