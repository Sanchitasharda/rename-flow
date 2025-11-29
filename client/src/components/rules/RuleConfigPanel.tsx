import { Rule, RuleType } from '../../types/Rule';
import { CasingRuleConfig } from './CasingRuleConfig';
import { PrefixRuleConfig } from './PrefixRuleConfig';
import { SuffixRuleConfig } from './SuffixRuleConfig';
import { NumberingRuleConfig } from './NumberingRuleConfig';
import { FindReplaceRuleConfig } from './FindReplaceRuleConfig';

interface RuleConfigPanelProps {
  rule: Rule;
  onClose: () => void;
}

export function RuleConfigPanel({ rule }: RuleConfigPanelProps) {
  const renderConfig = () => {
    switch (rule.type) {
      case RuleType.CASING: return <CasingRuleConfig rule={rule} />;
      case RuleType.PREFIX: return <PrefixRuleConfig rule={rule} />;
      case RuleType.SUFFIX: return <SuffixRuleConfig rule={rule} />;
      case RuleType.NUMBERING: return <NumberingRuleConfig rule={rule} />;
      case RuleType.FIND_REPLACE: return <FindReplaceRuleConfig rule={rule} />;
      default: return <div className="text-red-400">Unknown rule type</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Configuration
        </h3>
      </div>
      {renderConfig()}
    </div>
  );
}
