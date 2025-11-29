import { useState } from 'react';
import { SuffixRule } from '../../types/Rule';
import { useRuleStore } from '../../store/useRuleStore';

interface SuffixRuleConfigProps {
  rule: SuffixRule;
}

/**
 * Configuration panel for suffix rules
 */
export function SuffixRuleConfig({ rule }: SuffixRuleConfigProps) {
  const updateRule = useRuleStore((state) => state.updateRule);
  const [suffix, setSuffix] = useState(rule.config.text);

  const handleSave = () => {
    updateRule(rule.id, {
      config: { text: suffix },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor={`suffix-${rule.id}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Suffix Text
        </label>
        <input
          id={`suffix-${rule.id}`}
          type="text"
          value={suffix}
          onChange={(e) => setSuffix(e.target.value)}
          onBlur={handleSave}
          placeholder="e.g., _v2, _draft"
          className="w-full px-4 py-2.5 bg-[#0B0F19] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Preview:
        </p>
        <p className="font-mono text-gray-900 dark:text-white">
          <span className="text-gray-500">filename</span>
          {suffix || '(empty)'}
          <span className="text-gray-500">.jpg</span>
        </p>
      </div>
    </div>
  );
}
