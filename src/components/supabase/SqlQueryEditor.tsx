import React, { useState, useEffect } from 'react';
import { 
  Database, Play, Copy, Check, ExternalLink, Download, 
  RotateCcw, Sparkles, Table2, ShieldCheck, Zap, HardDrive, RefreshCw
} from 'lucide-react';
import { getSupabaseCredentials, getSupabaseClient } from '../../utils/storage';

export const ALL_SQL_PRESETS: Record<string, { title: string; category: string; description: string; sql: string }> = {
  all_in_one: {
    title: '🚀 Complete Setup (All Tables, RLS, Storage & Realtime)',
    category: 'Full Setup',
    description: 'Creates all required tables (bookings, blocked dates, CMS, reviews), sets up RLS policies, avatars bucket, and realtime publications.',
    sql: `-- ==========================================
-- 🏨 PENO HOMESTAY COMPLETE DATABASE SETUP
-- ==========================================

-- 1. Bookings Table
create table if not exists peno_bookings (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'pending',
  check_in timestamp with time zone not null,
  check_out timestamp with time zone not null,
  nights integer not null,
  total_eur numeric not null default 0,
  guest_name text not null,
  guest_email text not null,
  guest_wa text not null,
  guest_count integer not null default 1,
  notes text
);

-- 2. Blocked Dates Table
create table if not exists peno_blocked (
  date_str text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CMS & Homepage Table
create table if not exists peno_cms (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Reviews Table
create table if not exists peno_reviews (
  id text primary key,
  author text not null,
  role text default 'Tamu',
  comment text not null,
  rating integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table peno_bookings enable row level security;
alter table peno_blocked enable row level security;
alter table peno_cms enable row level security;
alter table peno_reviews enable row level security;

-- 6. RLS Policies for Bookings
drop policy if exists "Allow public select bookings" on peno_bookings;
create policy "Allow public select bookings" on peno_bookings for select using (true);

drop policy if exists "Allow public insert bookings" on peno_bookings;
create policy "Allow public insert bookings" on peno_bookings for insert with check (true);

drop policy if exists "Allow public update bookings" on peno_bookings;
create policy "Allow public update bookings" on peno_bookings for update using (true);

drop policy if exists "Allow public delete bookings" on peno_bookings;
create policy "Allow public delete bookings" on peno_bookings for delete using (true);

-- 7. RLS Policies for Blocked Dates
drop policy if exists "Allow public select blocked" on peno_blocked;
create policy "Allow public select blocked" on peno_blocked for select using (true);

drop policy if exists "Allow public insert blocked" on peno_blocked;
create policy "Allow public insert blocked" on peno_blocked for insert with check (true);

drop policy if exists "Allow public delete blocked" on peno_blocked;
create policy "Allow public delete blocked" on peno_blocked for delete using (true);

-- 8. RLS Policies for CMS
drop policy if exists "Allow public select cms" on peno_cms;
create policy "Allow public select cms" on peno_cms for select using (true);

drop policy if exists "Allow public upsert cms" on peno_cms;
create policy "Allow public upsert cms" on peno_cms for insert with check (true);

drop policy if exists "Allow public update cms" on peno_cms;
create policy "Allow public update cms" on peno_cms for update using (true);

-- 9. Storage Bucket for Avatars & Gallery Uploads
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public access for avatars" on storage.objects;
create policy "Public access for avatars" on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "Public upload for avatars" on storage.objects;
create policy "Public upload for avatars" on storage.objects for insert with check (bucket_id = 'avatars');

drop policy if exists "Public update for avatars" on storage.objects;
create policy "Public update for avatars" on storage.objects for update using (bucket_id = 'avatars');

drop policy if exists "Public delete for avatars" on storage.objects;
create policy "Public delete for avatars" on storage.objects for delete using (bucket_id = 'avatars');

-- 10. Enable Supabase Realtime for Live Booking Sync
alter publication supabase_realtime add table peno_bookings;
alter publication supabase_realtime add table peno_blocked;
alter publication supabase_realtime add table peno_cms;`
  },
  select_bookings: {
    title: '📋 Query: View All Bookings',
    category: 'Query & Inspect',
    description: 'Fetch all incoming bookings ordered by creation date.',
    sql: `SELECT id, guest_name, check_in, check_out, nights, total_eur, status, created_at 
FROM peno_bookings 
ORDER BY created_at DESC 
LIMIT 50;`
  },
  select_cms: {
    title: '🌐 Query: Inspect CMS & Settings Payload',
    category: 'Query & Inspect',
    description: 'Retrieve CMS documents (homepage, settings, gallery, notifications).',
    sql: `SELECT id, jsonb_pretty(data) as content, updated_at 
FROM peno_cms 
ORDER BY id ASC;`
  },
  select_blocked: {
    title: '📅 Query: View Blocked Dates',
    category: 'Query & Inspect',
    description: 'Fetch all calendar blocked date strings.',
    sql: `SELECT date_str, created_at 
FROM peno_blocked 
ORDER BY date_str ASC;`
  },
  enable_realtime: {
    title: '⚡ Setup Realtime Broadcast',
    category: 'Realtime',
    description: 'Enables Supabase Realtime broadcast for live updates across multi-device admin & booking calendar.',
    sql: `-- Enable publication for real-time live events
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

alter publication supabase_realtime add table peno_bookings;
alter publication supabase_realtime add table peno_blocked;
alter publication supabase_realtime add table peno_cms;`
  },
  storage_buckets: {
    title: '📦 Storage: Buckets & Public Upload Policies',
    category: 'Storage',
    description: 'Configures public avatars, gallery, and villa image buckets with RLS.',
    sql: `-- Create public image buckets
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

-- Storage object policies
create policy "Allow public read" on storage.objects for select using (bucket_id in ('avatars', 'gallery'));
create policy "Allow public insert" on storage.objects for insert with check (bucket_id in ('avatars', 'gallery'));
create policy "Allow public update" on storage.objects for update using (bucket_id in ('avatars', 'gallery'));
create policy "Allow public delete" on storage.objects for delete using (bucket_id in ('avatars', 'gallery'));`
  }
};

export const SqlQueryEditor: React.FC = () => {
  const { url, key } = getSupabaseCredentials();
  const projectRef = url.replace('https://', '').split('.')[0] || 'njgsafkwldootsupwjsb';
  const supabaseDashboardSqlUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

  const [activePresetKey, setActivePresetKey] = useState<string>('all_in_one');
  const [sqlQuery, setSqlQuery] = useState<string>(ALL_SQL_PRESETS.all_in_one.sql);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<{ columns: string[]; rows: any[]; error?: string; timeMs?: number } | null>(null);

  // Table Health Statuses
  const [tableStatus, setTableStatus] = useState<Record<string, 'ready' | 'missing' | 'checking'>>({
    peno_bookings: 'checking',
    peno_blocked: 'checking',
    peno_cms: 'checking'
  });

  const checkTableHealth = async () => {
    const client = getSupabaseClient();
    if (!client) {
      setTableStatus({ peno_bookings: 'missing', peno_blocked: 'missing', peno_cms: 'missing' });
      return;
    }

    const check = async (tbl: string) => {
      try {
        const { error } = await client.from(tbl).select('*').limit(1);
        return error ? 'missing' : 'ready';
      } catch {
        return 'missing';
      }
    };

    const b = await check('peno_bookings');
    const bl = await check('peno_blocked');
    const c = await check('peno_cms');

    setTableStatus({
      peno_bookings: b as any,
      peno_blocked: bl as any,
      peno_cms: c as any
    });
  };

  useEffect(() => {
    checkTableHealth();
  }, [url, key]);

  const handleSelectPreset = (presetKey: string) => {
    setActivePresetKey(presetKey);
    setSqlQuery(ALL_SQL_PRESETS[presetKey].sql);
    setQueryResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlQuery], { type: 'text/sql' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `peno_supabase_${activePresetKey}.sql`;
    a.click();
    URL.revokeObjectURL(u);
  };

  const handleRunQuery = async () => {
    setIsRunning(true);
    const start = performance.now();
    const client = getSupabaseClient();

    if (!client) {
      setIsRunning(false);
      setQueryResult({
        columns: [],
        rows: [],
        error: 'Supabase client is not connected. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.'
      });
      return;
    }

    try {
      // Parse table name if simple SELECT query
      const trimmed = sqlQuery.trim();
      const match = trimmed.match(/from\s+([a-zA-Z0-9_]+)/i);
      const tableName = match ? match[1] : null;

      if (trimmed.toUpperCase().startsWith('SELECT') && tableName) {
        const { data, error } = await client.from(tableName).select('*').limit(50);
        const duration = Math.round(performance.now() - start);

        if (error) {
          setQueryResult({ columns: [], rows: [], error: error.message, timeMs: duration });
        } else {
          const rows = data || [];
          const columns = rows.length > 0 ? Object.keys(rows[0]) : ['id', 'status', 'created_at'];
          setQueryResult({ columns, rows, timeMs: duration });
        }
      } else {
        // DDL (CREATE TABLE, ALTER, etc.) needs to be executed via Supabase SQL Editor
        const duration = Math.round(performance.now() - start);
        setQueryResult({
          columns: ['Info', 'Action'],
          rows: [{
            Info: 'DDL script ready for database execution.',
            Action: 'Supabase restricts CREATE TABLE/ALTER queries via anon REST API. Click "Open Supabase SQL Editor" to execute with 1-click!'
          }],
          timeMs: duration
        });
      }
    } catch (e: any) {
      setQueryResult({ columns: [], rows: [], error: e.message || 'Execution error' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Health Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Supabase SQL Query Editor & Integration Generator</h3>
          </div>
          <p className="text-xs text-slate-400">
            Generate, inspect, and execute complete PostgreSQL DDL and RLS schema for all Peno Homestay modules.
          </p>
        </div>

        {/* Live Table Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(tableStatus).map(([tbl, st]) => (
            <div 
              key={tbl} 
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                st === 'ready' 
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' 
                  : st === 'checking' 
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/30 animate-pulse' 
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${st === 'ready' ? 'bg-emerald-400' : st === 'checking' ? 'bg-amber-400' : 'bg-rose-400'}`} />
              <span>{tbl}</span>
            </div>
          ))}
          <button
            onClick={checkTableHealth}
            title="Refresh Table Health"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Category Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(ALL_SQL_PRESETS).map(([key, item]) => {
          const isActive = activePresetKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                isActive 
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/50' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                  {item.category}
                </span>
                {isActive && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <h4 className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* SQL Editor Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Editor Toolbar */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2 font-bold">
              sql_editor_{activePresetKey}.sql
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunQuery}
              disabled={isRunning}
              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running...' : 'Run / Test Query'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>

            <button
              onClick={handleDownload}
              title="Download SQL File"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <a
              href={supabaseDashboardSqlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-300 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Text Area Code Editor */}
        <div className="p-4 bg-slate-950 font-mono text-xs">
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={14}
            spellCheck={false}
            className="w-full bg-transparent text-emerald-300 focus:outline-none resize-y leading-relaxed font-mono selection:bg-emerald-900 selection:text-white"
          />
        </div>
      </div>

      {/* Query Result / Output Viewer */}
      {queryResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-2">
          <div className="bg-slate-850 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Table2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Query Result</span>
              {queryResult.timeMs !== undefined && (
                <span className="text-[10px] text-slate-400 font-mono">({queryResult.timeMs} ms)</span>
              )}
            </div>
            {queryResult.rows && (
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {queryResult.rows.length} rows
              </span>
            )}
          </div>

          {queryResult.error ? (
            <div className="p-4 text-xs font-mono text-rose-300 bg-rose-950/20 border border-rose-500/20 rounded-xl m-4">
              <p className="font-bold">Error:</p>
              <p>{queryResult.error}</p>
            </div>
          ) : (
            <div className="p-4 overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    {queryResult.columns.map((col) => (
                      <th key={col} className="pb-2 px-3 font-semibold text-[11px] uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {queryResult.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      {queryResult.columns.map((col) => (
                        <td key={col} className="py-2 px-3 truncate max-w-xs">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
