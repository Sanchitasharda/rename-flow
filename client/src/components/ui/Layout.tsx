import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen relative text-slate-200 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Layer */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-[#0B0F19]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-pink-900/10 blur-[100px]" />
      </div>

      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {children}
      </main>

      <footer className="border-t border-white/5 mt-auto backdrop-blur-md bg-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Privacy Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 shadow-lg shadow-black/20">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold tracking-wide text-slate-300">
                100% Private • Client-side Processing
              </span>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} <span className="font-semibold text-slate-300">RenameFlow</span>
              </p>
              <p className="text-xs text-slate-600 font-mono">
                v1.0.0-beta
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
