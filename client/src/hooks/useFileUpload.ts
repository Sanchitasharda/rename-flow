import { useCallback } from 'react';
import { useFileStore, useUIStore } from '../store';
import { FileService } from '../services/FileService';

/**
 * Custom hook for handling file uploads
 * Encapsulates upload logic, validation, and state management
 */
export function useFileUpload() {
  const files = useFileStore((state) => state.files);
  const totalSize = useFileStore((state) => state.totalSize);
  const addFiles = useFileStore((state) => state.addFiles);
  const clearFiles = useFileStore((state) => state.clearFiles);
  const { setError, setSuccess, setIsUploading } = useUIStore();

  /**
   * Handle file selection from input or drop
   */
  const handleFileSelect = useCallback(
    (selectedFiles: FileList | File[]) => {
      // Convert FileList to array
      const fileArray = Array.from(selectedFiles);

      if (fileArray.length === 0) {
        return;
      }

      setIsUploading(true);

      try {
        // Validate files
        const validation = FileService.validate(fileArray, files.length, totalSize);

        if (!validation.valid) {
          setError(validation.error || 'Invalid files');
          setIsUploading(false);
          return;
        }

        // Process files (convert to UploadedFile, sanitize, detect conflicts)
        const processedFiles = FileService.processFiles(fileArray, files);

        // Add to store
        addFiles(processedFiles);

        // Show success message
        const count = processedFiles.length;
        setSuccess(`Successfully uploaded ${count} file${count > 1 ? 's' : ''}`);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to upload files';
        setError(message);
      } finally {
        setIsUploading(false);
      }
    },
    [files, totalSize, addFiles, setError, setSuccess, setIsUploading]
  );

  /**
   * Handle file input change event
   */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (selectedFiles) {
        handleFileSelect(selectedFiles);
      }

      // Reset input value to allow selecting the same file again
      event.target.value = '';
    },
    [handleFileSelect]
  );

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles) {
        handleFileSelect(droppedFiles);
      }
    },
    [handleFileSelect]
  );

  /**
   * Handle clear all files
   */
  const handleClearAll = useCallback(() => {
    clearFiles();
    setSuccess('All files cleared');
    setTimeout(() => setSuccess(null), 2000);
  }, [clearFiles, setSuccess]);

  return {
    files,
    totalSize,
    handleInputChange,
    handleDrop,
    handleClearAll,
  };
}
