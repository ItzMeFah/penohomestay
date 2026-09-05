import React from 'react';
import { Database, Check, Copy, Info } from 'lucide-react';

interface PlaybookSqlSetupProps {
  sqlSnippets: {
    fullSetup: string;
    storageSetup: string;
  };
  copiedText: string | null;
  handleCopy: (text: string, id: string) => void;
}

export const PlaybookSqlSetup: React.FC<PlaybookSqlSetupProps> = ({
  sqlSnippets,
  copiedText,
  handleCopy
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 flex gap-4 text-emerald-300">
        <Info className="w-6 h-6 shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          <span className="font-bold block">Halo Bro! Bagian SQL ada di sini:</span>
          <p className="font-light">
            Supabase kamu sudah terhubung live dengan anon key. Untuk dapat melakukan registrasi, CRUD todo, dan upload file secara lancar di tab <b>"Live Sandbox"</b>, silakan salin kedua skrip SQL di bawah ini dan eksekusi di menu <b>Supabase Dashboard &rarr; SQL Editor</b>.
          </p>
        </div>
      </div>

      {/* Core Database & RLS Schema */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded text-xs font-mono font-bold">Langkah 1</span>
            <span>Skrip SQL Utama: Tabel, RLS, & Trigger Profil Otomatis</span>
          </h3>
          <button
            onClick={() => handleCopy(sqlSnippets.fullSetup, 'sql_main')}
            className="flex items-center space-x-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
          >
            {copiedText === 'sql_main' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText === 'sql_main' ? 'Copied!' : 'Copy SQL'}</span>
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-xs font-mono max-h-80 overflow-y-auto p-4 leading-relaxed text-slate-300">
          <pre>{sqlSnippets.fullSetup}</pre>
        </div>
      </div>

      {/* Storage Setup Schema */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded text-xs font-mono font-bold">Langkah 2</span>
            <span>Skrip SQL Storage: Bucket 'avatars' & RLS Upload</span>
          </h3>
          <button
            onClick={() => handleCopy(sqlSnippets.storageSetup, 'sql_storage')}
            className="flex items-center space-x-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
          >
            {copiedText === 'sql_storage' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText === 'sql_storage' ? 'Copied!' : 'Copy SQL'}</span>
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-xs font-mono max-h-80 overflow-y-auto p-4 leading-relaxed text-slate-300">
          <pre>{sqlSnippets.storageSetup}</pre>
        </div>
      </div>
    </div>
  );
};
