import type { UploadedFile } from '../../types';
import { formatFileSize } from '../../utils/fileHelpers';
import { FileListItem } from './FileListItem';

interface FileListProps {
  files: UploadedFile[];
  totalSize: number;
  onClearAll: () => void;
}

export function FileList({ files, totalSize, onClearAll }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-4 bg-[#131722]/50 rounded-3xl p-6 border border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Files</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-medium text-slate-300 border border-white/5">
            {files.length}
          </span>
          <span className="text-xs text-slate-500">
            {formatFileSize(totalSize)} total
          </span>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {files.map((file) => (
          <FileListItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
