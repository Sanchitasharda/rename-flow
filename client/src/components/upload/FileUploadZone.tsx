import { useRef, useState } from 'react';
import { useUIStore } from '../../store';
import { FILE_UPLOAD_LIMITS } from '../../types';
import { formatFileSize } from '../../utils/fileHelpers';

interface FileUploadZoneProps {
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadZone({ onDrop, onInputChange }: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { isUploading } = useUIStore();

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDropWrapper = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    onDrop(event);
  };

  return (
    <div
      className={`
        relative group overflow-hidden rounded-3xl transition-all duration-500
        ${isDragOver ? 'scale-[1.01]' : 'hover:scale-[1.01]'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropWrapper}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Animated Border Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${isDragOver ? 'animate-pulse' : ''}`} />

      {/* Inner Content Container */}
      <div className={`
        relative m-[1px] rounded-[23px] bg-[#0B0F19]/90 backdrop-blur-xl p-16 text-center cursor-pointer
        transition-all duration-300
        ${isDragOver ? 'bg-[#0B0F19]/80' : ''}
      `}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-6 relative z-10">
          {/* Icon Circle */}
          <div className="flex justify-center">
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500
              ${isDragOver
                ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]'}
            `}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {isDragOver ? 'Drop files now' : 'Upload Files'}
            </h3>
            <p className="text-slate-400 text-lg">
              Drag & drop or <span className="text-purple-400 font-medium border-b border-purple-400/30 pb-0.5">browse</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">Max {FILE_UPLOAD_LIMITS.MAX_FILES} files</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">Up to {formatFileSize(FILE_UPLOAD_LIMITS.MAX_TOTAL_SIZE)}</span>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-sm font-medium text-white tracking-wide animate-pulse">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
