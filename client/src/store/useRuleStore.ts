import { create } from 'zustand';
import type { Rule, RuleType, RuleConfig } from '../types/Rule';

interface RuleState {
  /** List of transformation rules */
  rules: Rule[];

  /** History for undo/redo functionality */
  history: Rule[][];
  historyIndex: number;

  /** Add a new rule and return its ID */
  addRule: (rule: Omit<Rule, 'id' | 'name'>) => string;

  /** Update an existing rule */
  updateRule: (ruleId: string, updates: Partial<Omit<Rule, 'id' | 'type'>>) => void;

  /** Remove a rule by ID */
  removeRule: (ruleId: string) => void;

  /** Toggle rule enabled/disabled */
  toggleRule: (ruleId: string) => void;

  /** Reorder rules (for drag & drop) */
  reorderRules: (startIndex: number, endIndex: number) => void;

  /** Clear all rules */
  clearRules: () => void;

  /** Undo last action */
  undo: () => void;

  /** Redo previously undone action */
  redo: () => void;

  /** Reset to empty state (with confirmation) */
  reset: () => void;

  /** Check if undo is available */
  canUndo: () => boolean;

  /** Check if redo is available */
  canRedo: () => boolean;

  /** Get rule by ID */
  getRuleById: (ruleId: string) => Rule | undefined;

  /** Get all enabled rules */
  getEnabledRules: () => Rule[];
}

const MAX_HISTORY_SIZE = 20;

// Helper function to save current state to history
const saveToHistory = (state: RuleState, newRules: Rule[]): Partial<RuleState> => {
  // Create new history by removing any future states after current index
  const newHistory = state.history.slice(0, state.historyIndex + 1);

  // Add current state to history
  newHistory.push([...state.rules]);

  // Limit history size
  if (newHistory.length > MAX_HISTORY_SIZE) {
    newHistory.shift();
  }

  return {
    rules: newRules,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const useRuleStore = create<RuleState>((set, get) => ({
  rules: [],
  history: [[]],
  historyIndex: 0,

  addRule: (ruleWithoutId) => {
    const newId = crypto.randomUUID();
    set((state) => {
      const newRule: Rule = {
        ...ruleWithoutId,
        id: newId,
      } as Rule;
      return saveToHistory(state, [...state.rules, newRule]);
    });
    return newId;
  },

  updateRule: (ruleId, updates) =>
    set((state) => {
      const newRules = state.rules.map((rule) => {
        if (rule.id !== ruleId) return rule;

        // Merge config if provided
        if ('config' in updates && updates.config) {
          return {
            ...rule,
            ...updates,
            config: { ...rule.config, ...updates.config },
          } as Rule;
        }

        return { ...rule, ...updates } as Rule;
      });
      return saveToHistory(state, newRules);
    }),

  removeRule: (ruleId) =>
    set((state) => {
      const newRules = state.rules.filter((rule) => rule.id !== ruleId);
      return saveToHistory(state, newRules);
    }),

  toggleRule: (ruleId) =>
    set((state) => {
      const newRules = state.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      );
      return saveToHistory(state, newRules);
    }),

  reorderRules: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.rules);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return saveToHistory(state, result);
    }),

  clearRules: () =>
    set((state) => saveToHistory(state, [])),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;

      const newIndex = state.historyIndex - 1;
      return {
        rules: [...state.history[newIndex]],
        historyIndex: newIndex,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;

      const newIndex = state.historyIndex + 1;
      return {
        rules: [...state.history[newIndex]],
        historyIndex: newIndex,
      };
    }),

  reset: () =>
    set((state) => ({
      rules: [],
      history: [[]],
      historyIndex: 0,
    })),

  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  getRuleById: (ruleId) => get().rules.find((rule) => rule.id === ruleId),

  getEnabledRules: () => get().rules.filter((rule) => rule.enabled),
}));
