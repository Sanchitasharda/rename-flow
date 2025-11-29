import { CasingRule, CasingType } from '../../types/Rule';
import { useRuleStore } from '../../store/useRuleStore';

interface CasingRuleConfigProps {
  rule: CasingRule;
}

export function CasingRuleConfig({ rule }: CasingRuleConfigProps) {
  const updateRule = useRuleStore((state) => state.updateRule);

  const caseTypes = [
    { value: CasingType.SNAKE_CASE, label: 'snake_case', example: 'my_file_name.jpg' },
    { value: CasingType.CAMEL_CASE, label: 'camelCase', example: 'myFileName.jpg' },
    { value: CasingType.PASCAL_CASE, label: 'PascalCase', example: 'MyFileName.jpg' },
    { value: CasingType.UPPER_CASE, label: 'UPPERCASE', example: 'MY_FILE_NAME.JPG' },
    { value: CasingType.LOWER_CASE, label: 'lowercase', example: 'myfilename.jpg' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-400">Target Format</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {caseTypes.map((caseType) => (
          <label
            key={caseType.value}
            className={`
              relative flex items-center p-3 rounded-lg cursor-pointer border transition-all duration-200
              ${rule.config.caseType === caseType.value
                ? 'bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/20'
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}
            `}
          >
            <input
              type="radio"
              name={`case-type-${rule.id}`}
              value={caseType.value}
              checked={rule.config.caseType === caseType.value}
              onChange={() => updateRule(rule.id, { config: { caseType: caseType.value } })}
              className="sr-only"
            />
            <div className="flex-1">
              <div className={`font-medium ${rule.config.caseType === caseType.value ? 'text-purple-300' : 'text-slate-300'}`}>
                {caseType.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">
                {caseType.example}
              </div>
            </div>
            {rule.config.caseType === caseType.value && (
              <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
