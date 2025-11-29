import { useEffect } from 'react';
import { useFileStore, useRuleStore } from '../store';
import { RenameService } from '../services/RenameService';

/**
 * Hook that automatically applies rules to files whenever rules change
 * Simplified version without ref caching to avoid React.StrictMode issues
 */
export function useRuleApplication() {
  const rules = useRuleStore((state) => state.rules);

  useEffect(() => {
    // Get current files from store
    const files = useFileStore.getState().files;

    // Don't apply rules if no files or no rules
    if (files.length === 0 || rules.length === 0) {
      return;
    }

    // Apply all rules to all files
    const renamedFiles = RenameService.applyRules(files, rules);

    // Update each file with its new name and conflict status
    renamedFiles.forEach((renamedFile) => {
      // Update file name
      useFileStore.getState().updateFileName(renamedFile.id, renamedFile.newName);

      // Update conflict status
      const hasConflict = renamedFile.hasConflict || false;
      useFileStore.getState().updateFileConflict(
        renamedFile.id,
        hasConflict,
        renamedFile.resolvedName
      );
    });
  }, [rules]);
}
