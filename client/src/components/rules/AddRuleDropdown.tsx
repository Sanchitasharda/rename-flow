import { useState, useRef, useEffect } from 'react';
import { useRuleStore } from '../../store/useRuleStore';
import {
  RuleType,
  CasingType,
  NumberingPlacement,
  CasingRule,
  PrefixRule,
  SuffixRule,
  NumberingRule,
  FindReplaceRule,
} from '../../types/Rule';

interface AddRuleDropdownProps {
  onRuleAdded?: (ruleId: string) => void;
}

export function AddRuleDropdown({ onRuleAdded }: AddRuleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addRule = useRuleStore((state) => state.addRule);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddRule = (type: RuleType) => {
    let newRule;
    // ... (Logic remains identical to original)
    switch (type) {
      case RuleType.CASING:
        newRule = { type: RuleType.CASING, config: { caseType: CasingType.LOWER_CASE }, enabled: true } as Omit<CasingRule, 'id' | 'name'>;
        break;
      case RuleType.PREFIX:
        newRule = { type: RuleType.PREFIX, config: { text: '' }, enabled: true } as Omit<PrefixRule, 'id' | 'name'>;
        break;
      case RuleType.SUFFIX:
        newRule = { type: RuleType.SUFFIX, config: { text: '' }, enabled: true } as Omit<SuffixRule, 'id' | 'name'>;
        break;
      case RuleType.NUMBERING:
        newRule = { type: RuleType.NUMBERING, config: { start: 1, padding: 3, placement: NumberingPlacement.SUFFIX }, enabled: true } as Omit<NumberingRule, 'id' | 'name'>;
        break;
      case RuleType.FIND_REPLACE:
        newRule = { type: RuleType.FIND_REPLACE, config: { find: '', replace: '', caseSensitive: false, replaceAll: true }, enabled: true } as Omit<FindReplaceRule, 'id' | 'name'>;
        break;
      default: return;
    }

    const newRuleId = addRule(newRule);
    setIsOpen(false);
    if (onRuleAdded) onRuleAdded(newRuleId);
  };

  const ruleTypes = [
    { type: RuleType.CASING, label: 'Casing', description: 'Format text case', icon: 'Aa', color: 'text-blue-400' },
    { type: RuleType.PREFIX, label: 'Prefix', description: 'Add text to start', icon: '←', color: 'text-emerald-400' },
    { type: RuleType.SUFFIX, label: 'Suffix', description: 'Add text to end', icon: '→', color: 'text-purple-400' },
    { type: RuleType.NUMBERING, label: 'Numbering', description: 'Sequential digits', icon: '#', color: 'text-amber-400' },
    { type: RuleType.FIND_REPLACE, label: 'Find & Replace', description: 'Swap text content', icon: '⇄', color: 'text-pink-400' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300
          ${isOpen
            ? 'bg-white/20 text-white shadow-lg shadow-purple-500/20'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 hover:-translate-y-0.5'}
        `}
      >
        <span className="text-lg leading-none mb-0.5">+</span>
        <span>Add Rule</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#1A1F2E]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Transformation
            </div>
            <div className="space-y-1">
              {ruleTypes.map((ruleType) => (
                <button
                  key={ruleType.type}
                  onClick={() => handleAddRule(ruleType.type)}
                  className="w-full text-left px-3 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-4 group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg font-bold ${ruleType.color} group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                    {ruleType.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-200 group-hover:text-white transition-colors">
                      {ruleType.label}
                    </div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-400">
                      {ruleType.description}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
