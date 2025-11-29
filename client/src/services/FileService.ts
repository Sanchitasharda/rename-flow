import type { UploadedFile, FileValidationResult } from '../types';
import { createUploadedFile, isDuplicateFilename } from '../utils/fileHelpers';
import { sanitizeFilename } from '../utils/fileSanitization';
import { validateFiles } from '../utils/fileValidation';

/**
 * Service for file operations following Single Responsibility Principle
 * Handles file conversion, validation, and conflict detection
 */
export class FileService {
  /**
   * Process uploaded files and convert to UploadedFile objects
   * @param files - Array of File objects from input/drop
   * @param existingFiles - Currently uploaded files (for duplicate detection)
   * @returns Array of UploadedFile objects
   */
  static processFiles(files: File[], existingFiles: UploadedFile[] = []): UploadedFile[] {
    const uploadedFiles = files.map(file => {
      const uploadedFile = createUploadedFile(file);

      // Sanitize the filename
      const sanitized = sanitizeFilename(uploadedFile.originalName);
      uploadedFile.newName = sanitized;

      return uploadedFile;
    });

    // Detect and mark conflicts
    return this.detectConflicts(uploadedFiles, existingFiles);
  }

  /**
   * Validate files before processing
   * @param files - Files to validate
   * @param currentFileCount - Current number of uploaded files
   * @param currentTotalSize - Current total size of uploaded files
   * @returns Validation result
   */
  static validate(
    files: File[],
    currentFileCount: number = 0,
    currentTotalSize: number = 0
  ): FileValidationResult {
    return validateFiles(files, currentFileCount, currentTotalSize);
  }

  /**
   * Detect duplicate filenames and mark conflicts
   * @param newFiles - New files to check
   * @param existingFiles - Existing uploaded files
   * @returns Files with conflict markers
   */
  static detectConflicts(
    newFiles: UploadedFile[],
    existingFiles: UploadedFile[] = []
  ): UploadedFile[] {
    // Combine all files for conflict detection
    const allFiles = [...existingFiles, ...newFiles];
    const filenameCounts = new Map<string, number>();

    // Count occurrences of each filename (case-insensitive)
    allFiles.forEach(file => {
      const lowerName = file.newName.toLowerCase();
      filenameCounts.set(lowerName, (filenameCounts.get(lowerName) || 0) + 1);
    });

    // Mark conflicts in new files
    return newFiles.map(file => {
      const lowerName = file.newName.toLowerCase();
      const count = filenameCounts.get(lowerName) || 0;

      if (count > 1) {
        // Conflict detected
        return {
          ...file,
          hasConflict: true,
        };
      }

      return file;
    });
  }

  /**
   * Resolve filename conflicts by appending counters
   * @param files - Files with potential conflicts
   * @returns Files with resolved unique names
   */
  static resolveConflicts(files: UploadedFile[]): UploadedFile[] {
    const nameMap = new Map<string, number>();

    return files.map(file => {
      let finalName = file.newName;
      const lowerName = finalName.toLowerCase();

      // Check if this name has been used
      const count = nameMap.get(lowerName);

      if (count !== undefined) {
        // Name collision, append counter
        const nameWithoutExt = finalName.substring(0, finalName.lastIndexOf('.'));
        const extension = finalName.substring(finalName.lastIndexOf('.'));
        const newCount = count + 1;

        finalName = `${nameWithoutExt}_${newCount}${extension}`;
        nameMap.set(lowerName, newCount);

        return {
          ...file,
          resolvedName: finalName,
          hasConflict: true,
        };
      } else {
        // First occurrence of this name
        nameMap.set(lowerName, 0);
        return {
          ...file,
          hasConflict: false,
          resolvedName: undefined,
        };
      }
    });
  }

  /**
   * Check if a filename already exists in the file list
   * @param filename - Filename to check
   * @param files - List of files to check against
   * @returns True if duplicate exists
   */
  static isDuplicate(filename: string, files: UploadedFile[]): boolean {
    return files.some(file => isDuplicateFilename(file.newName, filename));
  }

  /**
   * Get total size of an array of files
   * @param files - Files to calculate size for
   * @returns Total size in bytes
   */
  static getTotalSize(files: UploadedFile[]): number {
    return files.reduce((sum, file) => sum + file.size, 0);
  }
}
