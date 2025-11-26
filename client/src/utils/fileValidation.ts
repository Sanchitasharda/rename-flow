import { FILE_UPLOAD_LIMITS, type FileValidationResult } from '../types';
import { formatFileSize } from './fileHelpers';

/**
 * Validate a single file against size constraints
 * @param file - File to validate
 * @returns Validation result
 */
export function validateFile(file: File): FileValidationResult {
  // Check if file size exceeds maximum per file
  if (file.size > FILE_UPLOAD_LIMITS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" is too large. Maximum size per file is ${formatFileSize(FILE_UPLOAD_LIMITS.MAX_FILE_SIZE)}.`,
    };
  }

  // Check for empty files
  if (file.size === 0) {
    return {
      valid: false,
      error: `File "${file.name}" is empty (0 bytes).`,
    };
  }

  return { valid: true };
}

/**
 * Validate an array of files against all constraints
 * @param files - Array of files to validate
 * @param currentFileCount - Number of files already uploaded
 * @param currentTotalSize - Total size of files already uploaded
 * @returns Validation result
 */
export function validateFiles(
  files: File[],
  currentFileCount: number = 0,
  currentTotalSize: number = 0
): FileValidationResult {
  // Check if adding these files would exceed max file count
  const totalFileCount = currentFileCount + files.length;
  if (totalFileCount > FILE_UPLOAD_LIMITS.MAX_FILES) {
    const remaining = FILE_UPLOAD_LIMITS.MAX_FILES - currentFileCount;
    return {
      valid: false,
      error: `Cannot upload ${files.length} file${files.length > 1 ? 's' : ''}. Maximum ${FILE_UPLOAD_LIMITS.MAX_FILES} files allowed. You can upload ${remaining} more file${remaining !== 1 ? 's' : ''}.`,
    };
  }

  // Calculate total size of new files
  const newFilesSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSize = currentTotalSize + newFilesSize;

  // Check if total size would exceed maximum
  if (totalSize > FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE) {
    const remaining = FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE - currentTotalSize;
    return {
      valid: false,
      error: `Cannot upload files. Total size would be ${formatFileSize(totalSize)}, exceeding the ${formatFileSize(FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE)} limit. You have ${formatFileSize(remaining)} remaining.`,
    };
  }

  // Validate each individual file
  for (const file of files) {
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return fileValidation;
    }
  }

  return { valid: true };
}

/**
 * Validate file count constraint
 * @param count - Number of files to add
 * @param currentCount - Current file count
 * @returns Validation result
 */
export function validateFileCount(count: number, currentCount: number = 0): FileValidationResult {
  const totalCount = currentCount + count;

  if (totalCount > FILE_UPLOAD_LIMITS.MAX_FILES) {
    const remaining = FILE_UPLOAD_LIMITS.MAX_FILES - currentCount;
    return {
      valid: false,
      error: `Maximum ${FILE_UPLOAD_LIMITS.MAX_FILES} files allowed. You can upload ${remaining} more file${remaining !== 1 ? 's' : ''}.`,
    };
  }

  return { valid: true };
}

/**
 * Validate total size constraint
 * @param newSize - Size of files to add (in bytes)
 * @param currentSize - Current total size (in bytes)
 * @returns Validation result
 */
export function validateTotalSize(newSize: number, currentSize: number = 0): FileValidationResult {
  const totalSize = currentSize + newSize;

  if (totalSize > FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE) {
    const remaining = FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE - currentSize;
    return {
      valid: false,
      error: `Total size would exceed ${formatFileSize(FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE)} limit. You have ${formatFileSize(remaining)} remaining.`,
    };
  }

  return { valid: true };
}

/**
 * Filter out files that would cause validation errors
 * @param files - Files to filter
 * @param currentFileCount - Current file count
 * @param currentTotalSize - Current total size
 * @returns Object with valid files and error message if any were filtered
 */
export function filterValidFiles(
  files: File[],
  currentFileCount: number = 0,
  currentTotalSize: number = 0
): { validFiles: File[]; error?: string } {
  const validFiles: File[] = [];
  let rejectedCount = 0;
  let sizeExceeded = false;

  for (const file of files) {
    // Check individual file size
    if (file.size > FILE_UPLOAD_LIMITS.MAX_FILE_SIZE || file.size === 0) {
      rejectedCount++;
      continue;
    }

    // Check if adding this file would exceed limits
    const newFileCount = currentFileCount + validFiles.length + 1;
    const newTotalSize = currentTotalSize + validFiles.reduce((sum, f) => sum + f.size, 0) + file.size;

    if (newFileCount > FILE_UPLOAD_LIMITS.MAX_FILES) {
      rejectedCount++;
      continue;
    }

    if (newTotalSize > FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE) {
      rejectedCount++;
      sizeExceeded = true;
      continue;
    }

    validFiles.push(file);
  }

  let error: string | undefined;
  if (rejectedCount > 0) {
    if (sizeExceeded) {
      error = `${rejectedCount} file${rejectedCount > 1 ? 's' : ''} rejected due to size limits.`;
    } else {
      error = `${rejectedCount} file${rejectedCount > 1 ? 's were' : ' was'} rejected.`;
    }
  }

  return { validFiles, error };
}
