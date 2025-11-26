import { create } from 'zustand';

interface UIState {
  /** Dark mode enabled */
  darkMode: boolean;

  /** Toggle dark mode */
  toggleDarkMode: () => void;

  /** Set dark mode explicitly */
  setDarkMode: (enabled: boolean) => void;

  /** Upload in progress */
  isUploading: boolean;

  /** Set upload status */
  setIsUploading: (uploading: boolean) => void;

  /** Processing/generating ZIP */
  isProcessing: boolean;

  /** Set processing status */
  setIsProcessing: (processing: boolean) => void;

  /** Error message to display */
  error: string | null;

  /** Set error message */
  setError: (error: string | null) => void;

  /** Success message to display */
  success: string | null;

  /** Set success message */
  setSuccess: (success: string | null) => void;

  /** Clear all messages */
  clearMessages: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  darkMode: false,

  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.darkMode;
      // Update document class for Tailwind dark mode
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save to localStorage
      localStorage.setItem('renameflow-dark-mode', newDarkMode.toString());
      return { darkMode: newDarkMode };
    }),

  setDarkMode: (enabled) =>
    set(() => {
      // Update document class for Tailwind dark mode
      if (enabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save to localStorage
      localStorage.setItem('renameflow-dark-mode', enabled.toString());
      return { darkMode: enabled };
    }),

  isUploading: false,
  setIsUploading: (uploading) => set({ isUploading: uploading }),

  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),

  error: null,
  setError: (error) => set({ error }),

  success: null,
  setSuccess: (success) => set({ success }),

  clearMessages: () => set({ error: null, success: null }),
}));
