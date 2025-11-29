import { UploadedFile } from '../types/File';
import { Rule } from '../types/Rule';
import { RulePipeline } from './rule-engine';

/**
 * Service for applying renaming rules to files
 * Single Responsibility: Handles only the renaming logic
 */
export class RenameService {
  /**
   * Apply all rules to a batch of files
   * @param files - Files to rename
   * @param rules - Rules to apply
   * @returns Files with updated newName property
   */
  static applyRules(files: UploadedFile[], rules: Rule[]): UploadedFile[] {
    if (files.length === 0 || rules.length === 0) {
      return files;
    }

    // Extract filenames
    const filenames = files.map((file) => file.originalName);

    // Apply rules through pipeline
    const renamedFilenames = RulePipeline.applyRulesToBatch(filenames, rules);

    // Update files with new names
    const updatedFiles = files.map((file, index) => ({
      ...file,
      newName: renamedFilenames[index],
    }));

    // Handle duplicate filenames
    return this.resolveDuplicates(updatedFiles);
  }

  /**
   * Resolve duplicate filenames by appending counters
   * @param files - Files to check for duplicates
   * @returns Files with unique newName values
   */
  private static resolveDuplicates(files: UploadedFile[]): UploadedFile[] {
    const nameCount = new Map<string, number>();
    const result: UploadedFile[] = [];

    for (const file of files) {
      let newName = file.newName;
      const count = nameCount.get(newName.toLowerCase()) || 0;

      if (count > 0) {
        // Duplicate found - append counter
        const basename = this.getBasename(newName);
        const extension = this.getExtension(newName);
        newName = `${basename}_${count}${extension}`;
      }

      nameCount.set(newName.toLowerCase(), count + 1);

      result.push({
        ...file,
        newName,
        hasConflict: count > 0,
        resolvedName: count > 0 ? newName : undefined,
      });
    }

    return result;
  }

  /**
   * Get basename without extension
   */
  private static getBasename(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return filename;
    }
    return filename.substring(0, lastDotIndex);
  }

  /**
   * Get file extension with dot
   */
  private static getExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return '';
    }
    return filename.substring(lastDotIndex);
  }
}
