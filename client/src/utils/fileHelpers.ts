import type { UploadedFile } from '../types';

/**
 * Format file size from bytes to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "500 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Generate a unique ID for a file
 * @returns Unique identifier string
 */
export function generateFileId(): string {
  return crypto.randomUUID();
}

/**
 * Extract filename without extension
 * @param filename - Full filename with extension
 * @returns Filename without extension
 */
export function getFilenameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename; // No extension or hidden file
  }
  return filename.substring(0, lastDotIndex);
}

/**
 * Extract file extension including the dot
 * @param filename - Full filename with extension
 * @returns Extension with dot (e.g., ".txt") or empty string
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return ''; // No extension or hidden file
  }
  return filename.substring(lastDotIndex);
}

/**
 * Convert a File object to UploadedFile
 * @param file - Browser File object
 * @returns UploadedFile object
 */
export function createUploadedFile(file: File): UploadedFile {
  return {
    id: generateFileId(),
    originalName: file.name,
    newName: file.name, // Initially same as original
    size: file.size,
    type: file.type || 'application/octet-stream',
    file: file,
  };
}

/**
 * Get file type icon emoji based on MIME type or extension
 * @param mimeType - MIME type of the file
 * @param filename - Filename for extension fallback
 * @returns Icon emoji string
 */
export function getFileTypeIcon(mimeType: string, filename: string): string {
  // Check MIME type first
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.startsWith('text/')) return '📄';
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';

  // Fallback to extension
  const ext = getFileExtension(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) return '🖼️';
  if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) return '🎥';
  if (['.mp3', '.wav', '.flac', '.m4a'].includes(ext)) return '🎵';
  if (['.txt', '.md', '.log'].includes(ext)) return '📄';
  if (ext === '.pdf') return '📕';
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return '📦';
  if (['.doc', '.docx'].includes(ext)) return '📝';
  if (['.xls', '.xlsx', '.csv'].includes(ext)) return '📊';
  if (['.ppt', '.pptx'].includes(ext)) return '📽️';
  if (['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp'].includes(ext)) return '💻';

  return '📄'; // Default
}

/**
 * Check if two filenames are duplicates (case-insensitive)
 * @param filename1 - First filename
 * @param filename2 - Second filename
 * @returns True if duplicates
 */
export function isDuplicateFilename(filename1: string, filename2: string): boolean {
  return filename1.toLowerCase() === filename2.toLowerCase();
}
