import { useState } from 'react';
import { NumberingRule, NumberingPlacement } from '../../types/Rule';
import { useRuleStore } from '../../store/useRuleStore';

interface NumberingRuleConfigProps {
  rule: NumberingRule;
}

/**
 * Configuration panel for numbering rules
 */
export function NumberingRuleConfig({ rule }: NumberingRuleConfigProps) {
  const updateRule = useRuleStore((state) => state.updateRule);
  const [startValue, setStartValue] = useState(rule.config.start);
  const [padding, setPadding] = useState(rule.config.padding);
  const [placement, setPlacement] = useState(rule.config.placement);

  const handleSave = () => {
    updateRule(rule.id, {
      config: { start: startValue, padding, placement },
    });
  };

  const handlePlacementChange = (newPlacement: NumberingPlacement) => {
    setPlacement(newPlacement);
    updateRule(rule.id, {
      config: { start: startValue, padding, placement: newPlacement },
    });
  };

  const getPreviewNumber = () => {
    return startValue.toString().padStart(padding, '0');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`start-${rule.id}`}
            className="block text-sm font-medium text-slate-400 mb-2"
          >
            Start Value
          </label>
          <input
            id={`start-${rule.id}`}
            type="number"
            min="0"
            value={startValue}
            onChange={(e) => setStartValue(parseInt(e.target.value) || 0)}
            onBlur={handleSave}
            className="w-full px-4 py-2.5 bg-[#0B0F19] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor={`padding-${rule.id}`}
            className="block text-sm font-medium text-slate-400 mb-2"
          >
            Padding (Digits)
          </label>
          <input
            id={`padding-${rule.id}`}
            type="number"
            min="1"
            max="10"
            value={padding}
            onChange={(e) => setPadding(parseInt(e.target.value) || 1)}
            onBlur={handleSave}
            className="w-full px-4 py-2.5 bg-[#0B0F19] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Placement
        </label>
        <div className="space-y-2">
          <label className="flex items-center p-3 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors bg-white/5">
            <input
              type="radio"
              name={`placement-${rule.id}`}
              value={NumberingPlacement.PREFIX}
              checked={placement === NumberingPlacement.PREFIX}
              onChange={() => handlePlacementChange(NumberingPlacement.PREFIX)}
              className="mr-3"
            />
            <div>
              <div className="font-medium text-slate-300">
                Prefix (Before filename)
              </div>
              <div className="text-sm text-slate-500 font-mono">
                {getPreviewNumber()}_filename.jpg
              </div>
            </div>
          </label>

          <label className="flex items-center p-3 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors bg-white/5">
            <input
              type="radio"
              name={`placement-${rule.id}`}
              value={NumberingPlacement.SUFFIX}
              checked={placement === NumberingPlacement.SUFFIX}
              onChange={() => handlePlacementChange(NumberingPlacement.SUFFIX)}
              className="mr-3"
            />
            <div>
              <div className="font-medium text-slate-300">
                Suffix (After filename)
              </div>
              <div className="text-sm text-slate-500 font-mono">
                filename_{getPreviewNumber()}.jpg
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-black/20 border border-white/5 p-3 rounded-lg">
        <p className="text-sm text-slate-400 mb-1">
          Preview (first file):
        </p>
        <p className="font-mono text-white">
          {placement === NumberingPlacement.PREFIX
            ? `${getPreviewNumber()}_filename.jpg`
            : `filename_${getPreviewNumber()}.jpg`}
        </p>
      </div>
    </div>
  );
}
