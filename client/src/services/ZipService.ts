import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { UploadedFile } from '../types';

/**
 * Service for generating and downloading ZIP files with renamed files
 * Follows Single Responsibility Principle - handles only ZIP generation
 */
export class ZipService {
  /**
   * Generates a ZIP file containing all files with their new names
   * @param files - Array of uploaded files with renamed filenames
   * @param zipFileName - Name of the output ZIP file (default: "renamed-files.zip")
   * @returns Promise that resolves when ZIP is generated and download triggered
   */
  static async generateAndDownload(
    files: UploadedFile[],
    zipFileName: string = 'renamed-files.zip'
  ): Promise<void> {
    if (!files || files.length === 0) {
      throw new Error('No files to download');
    }

    try {
      // Create a new JSZip instance
      const zip = new JSZip();

      // Add each file to the ZIP with its new name
      // We need to read each File object's content separately to ensure
      // JSZip uses our custom filename instead of the File's embedded name
      for (const uploadedFile of files) {
        // Use the same logic as FileListItem.tsx (line 76) for consistency
        // If there's a conflict AND resolvedName exists, use resolvedName
        // Otherwise, use newName (which should have the renamed filename from rules)
        // Fallback to originalName if newName is somehow missing (defensive)
        const finalName = (uploadedFile.hasConflict && uploadedFile.resolvedName)
          ? uploadedFile.resolvedName
          : (uploadedFile.newName || uploadedFile.originalName);

        // Read the File object's content as an ArrayBuffer
        // This ensures JSZip uses our specified filename, not the File's original name
        const fileContent = await uploadedFile.file.arrayBuffer();

        // Add the file content to the ZIP with the new filename
        zip.file(finalName, fileContent);
      }

      // Generate the ZIP file as a Blob
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6, // Medium compression (1-9, where 9 is max)
        },
      });

      // Trigger browser download using FileSaver
      saveAs(blob, zipFileName);
    } catch (error) {
      console.error('Error generating ZIP file:', error);
      throw new Error(
        `Failed to generate ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validates that files are ready for ZIP generation
   * @param files - Array of uploaded files
   * @returns Validation result with success status and optional error message
   */
  static validateForDownload(files: UploadedFile[]): {
    isValid: boolean;
    error?: string;
  } {
    if (!files || files.length === 0) {
      return {
        isValid: false,
        error: 'No files uploaded. Please upload files before downloading.',
      };
    }

    // Check if all files have valid new names
    const filesWithInvalidNames = files.filter(
      (file) => !file.newName || file.newName.trim() === ''
    );

    if (filesWithInvalidNames.length > 0) {
      return {
        isValid: false,
        error: 'Some files have invalid names. Please check your rules.',
      };
    }

    return { isValid: true };
  }

  /**
   * Estimates the ZIP file size (approximate)
   * @param files - Array of uploaded files
   * @returns Estimated ZIP size in bytes
   */
  static estimateZipSize(files: UploadedFile[]): number {
    // Rough estimate: 70% of original size with medium compression
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    return Math.floor(totalSize * 0.7);
  }
}
