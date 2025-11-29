import { useState } from 'react';
import { FindReplaceRule } from '../../types/Rule';
import { useRuleStore } from '../../store/useRuleStore';

interface FindReplaceRuleConfigProps {
  rule: FindReplaceRule;
}

/**
 * Configuration panel for find & replace rules
 */
export function FindReplaceRuleConfig({ rule }: FindReplaceRuleConfigProps) {
  const updateRule = useRuleStore((state) => state.updateRule);
  const [find, setFind] = useState(rule.config.find);
  const [replace, setReplace] = useState(rule.config.replace);
  const [caseSensitive, setCaseSensitive] = useState(rule.config.caseSensitive);
  const [replaceAll, setReplaceAll] = useState(rule.config.replaceAll);

  const handleSave = () => {
    updateRule(rule.id, {
      config: { find, replace, caseSensitive, replaceAll },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor={`find-${rule.id}`}
          className="block text-sm font-medium text-slate-400 mb-2"
        >
          Find Text
        </label>
        <input
          id={`find-${rule.id}`}
          type="text"
          value={find}
          onChange={(e) => setFind(e.target.value)}
          onBlur={handleSave}
          placeholder="Text to find"
          className="w-full px-4 py-2.5 bg-[#0B0F19] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor={`replace-${rule.id}`}
          className="block text-sm font-medium text-slate-400 mb-2"
        >
          Replace With
        </label>
        <input
          id={`replace-${rule.id}`}
          type="text"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          onBlur={handleSave}
          placeholder="Replacement text"
          className="w-full px-4 py-2.5 bg-[#0B0F19] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center p-3 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors bg-white/5">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => {
              setCaseSensitive(e.target.checked);
              handleSave();
            }}
            className="mr-3"
          />
          <div>
            <div className="font-medium text-slate-300">
              Case Sensitive
            </div>
            <div className="text-sm text-slate-500">
              Match exact case when finding text
            </div>
          </div>
        </label>

        <label className="flex items-center p-3 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors bg-white/5">
          <input
            type="checkbox"
            checked={replaceAll}
            onChange={(e) => {
              setReplaceAll(e.target.checked);
              handleSave();
            }}
            className="mr-3"
          />
          <div>
            <div className="font-medium text-slate-300">
              Replace All Occurrences
            </div>
            <div className="text-sm text-slate-500">
              Replace all matches (or just the first one)
            </div>
          </div>
        </label>
      </div>

      <div className="bg-black/20 border border-white/5 p-3 rounded-lg">
        <p className="text-sm text-slate-400 mb-1">
          Preview:
        </p>
        <p className="font-mono text-sm">
          <span className="text-red-400 line-through">
            {find || 'text'}
          </span>
          <span className="text-slate-500"> → </span>
          <span className="text-emerald-400">
            {replace || '(empty)'}
          </span>
        </p>
      </div>
    </div>
  );
}
