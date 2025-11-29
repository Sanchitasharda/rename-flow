import type { UploadedFile } from '../../types';
import { useFileStore } from '../../store';
import { formatFileSize, getFileTypeIcon } from '../../utils/fileHelpers';

interface FileListItemProps {
  file: UploadedFile;
}

export function FileListItem({ file }: FileListItemProps) {
  const removeFile = useFileStore((state) => state.removeFile);

  return (
    <div className={`
      group flex items-center justify-between p-3 rounded-xl border backdrop-blur-sm transition-all duration-300
      ${file.hasConflict
        ? 'bg-amber-900/10 border-amber-500/20 hover:border-amber-500/40'
        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}
    `}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-[#0B0F19] flex items-center justify-center text-xl border border-white/5">
          {getFileTypeIcon(file.type, file.originalName)}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="flex flex-col justify-center">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Original</span>
            <span className="text-sm text-slate-300 truncate font-mono" title={file.originalName}>
              {file.originalName}
            </span>
          </div>

          {/* New Name */}
          <div className="flex flex-col justify-center relative">
            {file.newName !== file.originalName && (
              <>
                <span className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  Result
                  {file.hasConflict && <span className="text-amber-500">• Duplicate Resolved</span>}
                </span>
                <span className={`text-sm truncate font-mono font-medium ${file.hasConflict ? 'text-amber-300' : 'text-white'}`}>
                  {file.hasConflict && file.resolvedName ? file.resolvedName : file.newName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Meta & Actions */}
      <div className="flex items-center gap-4 pl-4 border-l border-white/5 ml-4">
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
          {formatFileSize(file.size)}
        </span>
        <button
          onClick={() => removeFile(file.id)}
          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
