/**
 * Represents an uploaded file with metadata
 */
export interface UploadedFile {
  /** Unique identifier for the file */
  id: string;

  /** Original filename */
  originalName: string;

  /** New filename after applying rules */
  newName: string;

  /** File size in bytes */
  size: number;

  /** MIME type of the file */
  type: string;

  /** The actual File object */
  file: File;

  /** Whether there's a naming conflict */
  hasConflict?: boolean;

  /** Conflict resolution (e.g., "file_1.txt") */
  resolvedName?: string;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * File upload constraints
 */
export const FILE_UPLOAD_LIMITS = {
  MAX_FILES: 500,
  MAX_TOTAL_SIZE: 100 * 1024 * 1024, // 100MB in bytes
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB per file
} as const;
