/**
 * Available rule types for file renaming
 */
export enum RuleType {
  CASING = 'casing',
  PREFIX = 'prefix',
  SUFFIX = 'suffix',
  NUMBERING = 'numbering',
  FIND_REPLACE = 'findReplace',
}

/**
 * Available casing options
 */
export enum CasingType {
  SNAKE_CASE = 'snake_case',
  CAMEL_CASE = 'camelCase',
  PASCAL_CASE = 'PascalCase',
  UPPER_CASE = 'UPPERCASE',
  LOWER_CASE = 'lowercase',
}

/**
 * Numbering placement options
 */
export enum NumberingPlacement {
  PREFIX = 'prefix',
  SUFFIX = 'suffix',
}

/**
 * Base interface for all rules
 */
export interface BaseRule {
  /** Unique identifier for the rule */
  id: string;

  /** Type of the rule */
  type: RuleType;

  /** Whether the rule is currently active */
  enabled: boolean;

  /** Display name for the rule */
  name?: string;
}

/**
 * Casing transformation rule
 */
export interface CasingRule extends BaseRule {
  type: RuleType.CASING;
  config: {
    caseType: CasingType;
  };
}

/**
 * Prefix rule - adds text before filename
 */
export interface PrefixRule extends BaseRule {
  type: RuleType.PREFIX;
  config: {
    text: string;
  };
}

/**
 * Suffix rule - adds text before extension
 */
export interface SuffixRule extends BaseRule {
  type: RuleType.SUFFIX;
  config: {
    text: string;
  };
}

/**
 * Sequential numbering rule
 */
export interface NumberingRule extends BaseRule {
  type: RuleType.NUMBERING;
  config: {
    /** Starting number (default: 1) */
    start: number;

    /** Number of digits for padding (default: 1, e.g., 3 = 001, 002) */
    padding: number;

    /** Where to place the number */
    placement: NumberingPlacement;

    /** Optional separator between number and filename */
    separator?: string;
  };
}

/**
 * Find and replace rule
 */
export interface FindReplaceRule extends BaseRule {
  type: RuleType.FIND_REPLACE;
  config: {
    /** Text to find */
    find: string;

    /** Text to replace with */
    replace: string;

    /** Whether search is case-sensitive */
    caseSensitive: boolean;

    /** Replace all occurrences or just the first */
    replaceAll: boolean;
  };
}

/**
 * Union type of all possible rules
 */
export type Rule = CasingRule | PrefixRule | SuffixRule | NumberingRule | FindReplaceRule;

/**
 * Rule configuration for creating new rules
 */
export type RuleConfig<T extends RuleType> = T extends RuleType.CASING
  ? CasingRule['config']
  : T extends RuleType.PREFIX
  ? PrefixRule['config']
  : T extends RuleType.SUFFIX
  ? SuffixRule['config']
  : T extends RuleType.NUMBERING
  ? NumberingRule['config']
  : T extends RuleType.FIND_REPLACE
  ? FindReplaceRule['config']
  : never;
