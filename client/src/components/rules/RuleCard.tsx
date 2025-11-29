import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Rule, RuleType } from '../../types/Rule';
import { useRuleStore } from '../../store/useRuleStore';
import { RuleConfigPanel } from './RuleConfigPanel';

interface RuleCardProps {
  rule: Rule;
  index: number;
  autoOpenEdit?: boolean;
}

export function RuleCard({ rule, index, autoOpenEdit = false }: RuleCardProps) {
  const [isEditing, setIsEditing] = useState(autoOpenEdit);
  const removeRule = useRuleStore((state) => state.removeRule);
  const toggleRule = useRuleStore((state) => state.toggleRule);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });

  const getRuleTypeLabel = (type: RuleType) => {
    switch (type) {
      case RuleType.CASING: return { label: 'Casing', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case RuleType.PREFIX: return { label: 'Prefix', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case RuleType.SUFFIX: return { label: 'Suffix', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case RuleType.NUMBERING: return { label: 'Numbering', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case RuleType.FIND_REPLACE: return { label: 'Find & Replace', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      default: return { label: 'Rule', color: 'bg-slate-500/10 text-slate-400' };
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const typeInfo = getRuleTypeLabel(rule.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative rounded-2xl border transition-all duration-300
        ${isDragging ? 'shadow-2xl shadow-purple-500/20 border-purple-500/50 bg-[#1A1F2E]' : 'bg-[#131722]/80 border-white/5 hover:border-white/10 hover:bg-[#1A1F2E]'}
        ${isEditing ? 'ring-1 ring-purple-500/30 bg-[#1A1F2E]' : ''}
        ${!rule.enabled ? 'opacity-60 grayscale-[0.5]' : ''}
      `}
    >
      {/* Header / Summary Row */}
      <div
        className="flex items-center p-4 gap-4 cursor-pointer"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) setIsEditing(!isEditing);
        }}
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 cursor-grab active:cursor-grabbing transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Index & Type */}
        <div className="flex items-center gap-3 flex-1">
          <span className="font-mono text-xs text-slate-600">#{String(index + 1).padStart(2, '0')}</span>
          <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          {rule.name && <span className="text-slate-300 font-medium text-sm">{rule.name}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); toggleRule(rule.id); }}
            className={`p-2 rounded-lg transition-colors ${rule.enabled ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            title={rule.enabled ? "Disable Rule" : "Enable Rule"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
            className={`p-2 rounded-lg transition-colors ${isEditing ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); removeRule(rule.id); }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Config Panel */}
      {isEditing && (
        <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 rounded-xl bg-black/20 border border-white/5">
            <RuleConfigPanel rule={rule} onClose={() => setIsEditing(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
