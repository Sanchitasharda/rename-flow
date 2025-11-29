import { useEffect, useState } from 'react';
import { Layout } from './components/ui';
import { FileUploadZone, FileList } from './components/upload';
import { RuleList } from './components/rules';
import { useUIStore, useRuleStore, useFileStore } from './store';
import { useFileUpload } from './hooks/useFileUpload';
import { useRuleApplication } from './hooks/useRuleApplication';
import { ZipService } from './services/ZipService';

function App() {
  const { setDarkMode, error, success, clearMessages, setError, setSuccess } = useUIStore();
  const { files, totalSize, handleInputChange, handleDrop, handleClearAll } = useFileUpload();
  const storeFiles = useFileStore((state) => state.files);
  const [isDownloading, setIsDownloading] = useState(false);

  useRuleApplication();

  useEffect(() => {
    setDarkMode(true); // Force dark mode for this specific aesthetic
  }, [setDarkMode]);

  const handleDownload = async () => {
    clearMessages();
    const validation = ZipService.validateForDownload(storeFiles);
    if (!validation.isValid) {
      setError(validation.error || 'Cannot download files');
      return;
    }
    try {
      setIsDownloading(true);
      await ZipService.generateAndDownload(storeFiles, 'renamed-files.zip');
      setSuccess(`Successfully downloaded ${storeFiles.length} files!`);
      setTimeout(clearMessages, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download files');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Rename<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Flow</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The modern way to batch rename files.
            <br className="hidden md:block" />
            Secure, client-side, and beautifully simple.
          </p>
        </div>

        {/* Notifications */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 pointer-events-none">
          {error && (
            <div className="pointer-events-auto bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl backdrop-blur-xl shadow-xl animate-in slide-in-from-bottom-5 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
              <button onClick={clearMessages} className="ml-2 hover:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          )}
          {success && (
            <div className="pointer-events-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-4 py-3 rounded-xl backdrop-blur-xl shadow-xl animate-in slide-in-from-bottom-5 flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {success}
            </div>
          )}
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload & Files */}
          <div className="lg:col-span-7 space-y-6">
            <FileUploadZone onDrop={handleDrop} onInputChange={handleInputChange} />
            <FileList files={files} totalSize={totalSize} onClearAll={handleClearAll} />
          </div>

          {/* Right Column: Rules */}
          <div className="lg:col-span-5">
            {files.length > 0 ? (
              <div className="sticky top-24 space-y-6">
                <RuleList />
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download ZIP
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Empty State / Features
              <div className="h-full flex flex-col justify-center space-y-4 opacity-60">
                <FeatureCard icon="⚡" title="Lightning Fast" desc="Process thousands of files instantly in your browser." />
                <FeatureCard icon="🔒" title="100% Private" desc="Files never leave your device. Zero server uploads." />
                <FeatureCard icon="🎨" title="Smart Rules" desc="Chain multiple rules for complex renaming logic." />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}

export default App;
