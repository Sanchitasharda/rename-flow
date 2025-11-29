import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useRuleStore } from '../../store/useRuleStore';
import { RuleCard } from './RuleCard';
import { AddRuleDropdown } from './AddRuleDropdown';

/**
 * Container component for displaying and managing all rules
 * Supports drag & drop reordering via @dnd-kit
 */
export function RuleList() {
  const rules = useRuleStore((state) => state.rules);
  const reorderRules = useRuleStore((state) => state.reorderRules);
  const undo = useRuleStore((state) => state.undo);
  const redo = useRuleStore((state) => state.redo);
  const reset = useRuleStore((state) => state.reset);
  const canUndo = useRuleStore((state) => state.canUndo());
  const canRedo = useRuleStore((state) => state.canRedo());

  // Track newly added rule to auto-open its edit panel
  const [newlyAddedRuleId, setNewlyAddedRuleId] = React.useState<string | null>(null);

  // Handle newly added rule
  const handleRuleAdded = (ruleId: string) => {
    setNewlyAddedRuleId(ruleId);

    // Clear the flag after a short delay to allow RuleCard to initialize
    setTimeout(() => {
      setNewlyAddedRuleId(null);
    }, 100);
  };

  // Configure sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging 8px before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = rules.findIndex((rule) => rule.id === active.id);
    const newIndex = rules.findIndex((rule) => rule.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderRules(oldIndex, newIndex);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (event: KeyboardEvent) => {
    // Undo: Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      if (canUndo) {
        undo();
      }
    }
    // Redo: Ctrl+Shift+Z or Ctrl+Y
    else if (
      ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') ||
      ((event.ctrlKey || event.metaKey) && event.key === 'y')
    ) {
      event.preventDefault();
      if (canRedo) {
        redo();
      }
    }
  };

  // Add keyboard event listener
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [canUndo, canRedo]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all rules? This action cannot be undone.')) {
      reset();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          Renaming Rules
        </h2>
        <div className="flex items-center gap-2">
          {/* Undo/Redo buttons */}
          {rules.length > 0 && (
            <>
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Undo last action (Ctrl+Z)"
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Redo last undone action (Ctrl+Shift+Z)"
                title="Redo (Ctrl+Shift+Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 text-sm font-medium rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                aria-label="Reset all rules"
                title="Reset All Rules"
              >
                Reset
              </button>
            </>
          )}
          <AddRuleDropdown onRuleAdded={handleRuleAdded} />
        </div>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
          <p className="text-slate-400">
            No rules added yet. Click "Add Rule" above to start renaming!
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rules.map((rule) => rule.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  index={index}
                  autoOpenEdit={rule.id === newlyAddedRuleId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
