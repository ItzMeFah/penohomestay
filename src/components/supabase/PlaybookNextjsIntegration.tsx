import React from 'react';
import { Folder, FileCode, ChevronRight, FileText, Key, Check, Copy } from 'lucide-react';

interface PlaybookNextjsIntegrationProps {
  selectedFile: string;
  setSelectedFile: (file: string) => void;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (folder: string) => void;
  fileContent: Record<string, string>;
  copiedText: string | null;
  handleCopy: (text: string, id: string) => void;
}

export const PlaybookNextjsIntegration: React.FC<PlaybookNextjsIntegrationProps> = ({
  selectedFile,
  setSelectedFile,
  expandedFolders,
  toggleFolder,
  fileContent,
  copiedText,
  handleCopy
}) => {
  const currentFileCode = fileContent[selectedFile] || '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* File Explorer (Col 4) */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Project Tree</span>
        
        <div className="font-mono text-xs text-slate-300 space-y-1 select-none flex-1 overflow-y-auto">
          {/* Root items */}
          <div 
            onClick={() => setSelectedFile('package.json')}
            className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'package.json' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>package.json</span>
          </div>

          <div 
            onClick={() => setSelectedFile('.env.local')}
            className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === '.env.local' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>.env.local</span>
          </div>

          {/* lib Folder */}
          <div className="space-y-1">
            <div 
              onClick={() => toggleFolder('lib')}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-slate-400"
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedFolders['lib'] ? 'rotate-90' : ''}`} />
              <Folder className="w-4 h-4 text-yellow-500" />
              <span>lib</span>
            </div>

            {expandedFolders['lib'] && (
              <div className="pl-6 space-y-1 border-l border-slate-800 ml-3">
                <div 
                  onClick={() => toggleFolder('lib/supabase')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-slate-400"
                >
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedFolders['lib/supabase'] ? 'rotate-90' : ''}`} />
                  <Folder className="w-4 h-4 text-yellow-500" />
                  <span>supabase</span>
                </div>

                {expandedFolders['lib/supabase'] && (
                  <div className="pl-6 space-y-1 border-l border-slate-800 ml-3">
                    <div 
                      onClick={() => setSelectedFile('lib/supabase/client.ts')}
                      className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'lib/supabase/client.ts' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
                    >
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <span>client.ts</span>
                    </div>
                    <div 
                      onClick={() => setSelectedFile('lib/supabase/server.ts')}
                      className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'lib/supabase/server.ts' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
                    >
                      <FileCode className="w-4 h-4 text-rose-400" />
                      <span>server.ts</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* middleware */}
          <div 
            onClick={() => setSelectedFile('middleware.ts')}
            className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'middleware.ts' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
          >
            <FileCode className="w-4 h-4 text-violet-400" />
            <span>middleware.ts</span>
          </div>

          {/* app Folder */}
          <div className="space-y-1">
            <div 
              onClick={() => toggleFolder('app')}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-slate-400"
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedFolders['app'] ? 'rotate-90' : ''}`} />
              <Folder className="w-4 h-4 text-yellow-500" />
              <span>app</span>
            </div>

            {expandedFolders['app'] && (
              <div className="pl-6 space-y-1 border-l border-slate-800 ml-3">
                
                {/* app/login Folder */}
                <div className="space-y-1">
                  <div 
                    onClick={() => toggleFolder('app/login')}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-slate-400"
                  >
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedFolders['app/login'] ? 'rotate-90' : ''}`} />
                    <Folder className="w-4 h-4 text-yellow-500" />
                    <span>login</span>
                  </div>

                  {expandedFolders['app/login'] && (
                    <div className="pl-6 space-y-1 border-l border-slate-800 ml-3">
                      <div 
                        onClick={() => setSelectedFile('app/login/page.tsx')}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'app/login/page.tsx' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
                      >
                        <FileCode className="w-4 h-4 text-amber-400" />
                        <span>page.tsx</span>
                      </div>
                      <div 
                        onClick={() => setSelectedFile('app/login/actions.ts')}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'app/login/actions.ts' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
                      >
                        <FileCode className="w-4 h-4 text-orange-400" />
                        <span>actions.ts</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* app/dashboard Folder */}
                <div className="space-y-1">
                  <div 
                    onClick={() => toggleFolder('app/dashboard')}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-slate-400"
                  >
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedFolders['app/dashboard'] ? 'rotate-90' : ''}`} />
                    <Folder className="w-4 h-4 text-yellow-500" />
                    <span>dashboard</span>
                  </div>

                  {expandedFolders['app/dashboard'] && (
                    <div className="pl-6 space-y-1 border-l border-slate-800 ml-3">
                      <div 
                        onClick={() => setSelectedFile('app/dashboard/page.tsx')}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'app/dashboard/page.tsx' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
                      >
                        <FileCode className="w-4 h-4 text-amber-400" />
                        <span>page.tsx</span>
                      </div>
                      <div 
                        onClick={() => setSelectedFile('app/dashboard/todo-list.tsx')}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'app/dashboard/todo-list.tsx' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
                      >
                        <FileCode className="w-4 h-4 text-amber-400" />
                        <span>todo-list.tsx</span>
                      </div>
                      <div 
                        onClick={() => setSelectedFile('app/dashboard/actions.ts')}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer ${selectedFile === 'app/dashboard/actions.ts' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800'}`}
                      >
                        <FileCode className="w-4 h-4 text-orange-400" />
                        <span>actions.ts</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
        
        <div className="border-t border-slate-800 pt-3">
          <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block mb-1">Architecture Summary</span>
          <p className="text-[11px] text-slate-400 font-sans font-light leading-relaxed">
            Struktur ini menggunakan pattern modern Next.js 15: Autentikasi di-handle <b>Middleware</b>, server actions mengelola <b>CRUD DB</b>, dan cookie-storage di-sync secara aman.
          </p>
        </div>
      </div>

      {/* Code Viewer (Col 8) */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs text-white font-bold">{selectedFile}</span>
          </div>
          
          <button
            onClick={() => handleCopy(currentFileCode, selectedFile)}
            className="flex items-center space-x-1 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
          >
            {copiedText === selectedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText === selectedFile ? 'Copied!' : 'Copy File'}</span>
          </button>
        </div>

        {/* Scrollable Viewport */}
        <div className="flex-1 bg-slate-950 border border-slate-850 p-4 rounded-xl overflow-y-auto text-xs font-mono text-slate-300 max-h-[480px]">
          <pre className="whitespace-pre">{currentFileCode}</pre>
        </div>
      </div>
    </div>
  );
};
