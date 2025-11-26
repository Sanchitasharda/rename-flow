import { create } from 'zustand';
import type { UploadedFile } from '../types/File';

interface FileState {
  /** List of uploaded files */
  files: UploadedFile[];

  /** Total size of all uploaded files in bytes */
  totalSize: number;

  /** Add a single file */
  addFile: (file: UploadedFile) => void;

  /** Add multiple files */
  addFiles: (files: UploadedFile[]) => void;

  /** Remove a file by ID */
  removeFile: (fileId: string) => void;

  /** Update a file's new name */
  updateFileName: (fileId: string, newName: string) => void;

  /** Clear all files */
  clearFiles: () => void;

  /** Update file conflict status */
  updateFileConflict: (fileId: string, hasConflict: boolean, resolvedName?: string) => void;

  /** Get file by ID */
  getFileById: (fileId: string) => UploadedFile | undefined;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  totalSize: 0,

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
      totalSize: state.totalSize + file.size,
    })),

  addFiles: (newFiles) =>
    set((state) => {
      const totalNewSize = newFiles.reduce((sum, file) => sum + file.size, 0);
      return {
        files: [...state.files, ...newFiles],
        totalSize: state.totalSize + totalNewSize,
      };
    }),

  removeFile: (fileId) =>
    set((state) => {
      const fileToRemove = state.files.find((f) => f.id === fileId);
      const sizeToRemove = fileToRemove ? fileToRemove.size : 0;
      return {
        files: state.files.filter((f) => f.id !== fileId),
        totalSize: state.totalSize - sizeToRemove,
      };
    }),

  updateFileName: (fileId, newName) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, newName } : f
      ),
    })),

  clearFiles: () =>
    set({
      files: [],
      totalSize: 0,
    }),

  updateFileConflict: (fileId, hasConflict, resolvedName) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, hasConflict, resolvedName } : f
      ),
    })),

  getFileById: (fileId) => get().files.find((f) => f.id === fileId),
}));
