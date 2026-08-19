import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Code2, Terminal
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { PlaybookSqlSetup } from '../components/supabase/PlaybookSqlSetup';
import { PlaybookNextjsIntegration } from '../components/supabase/PlaybookNextjsIntegration';
import { PlaybookSandbox } from '../components/supabase/PlaybookSandbox';

// User's actual Supabase credentials for live sandbox testing
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || localStorage.getItem("peno_supabase_url") || "";
const ACTUAL_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem("peno_supabase_anon_key") || "";

// Initialize the live sandbox Supabase client via a safe dynamic proxy to avoid crashes when keys are missing
const liveSupabaseClient = new Proxy({} as any, {
  get(target, prop) {
    if (!SUPABASE_URL || !ACTUAL_KEY) {
      // Safe mock implementation for missing credentials
      if (prop === 'auth') {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase URL/Key is not configured" } }),
          signInWithPassword: () => Promise.resolve({ data: { session: null }, error: { message: "Supabase URL/Key is not configured" } }),
          signOut: () => Promise.resolve({ error: null })
        };
      }
      if (prop === 'storage') {
        return {
          from: () => ({
            upload: () => Promise.resolve({ data: null, error: { message: "Supabase URL/Key is not configured" } }),
            getPublicUrl: () => ({ data: { publicUrl: "" } })
          })
        };
      }
      return (...args: any[]) => {
        const dummyQuery: any = {
          select: () => Promise.resolve({ data: [], error: { message: "Supabase URL/Key is not configured" } }),
          upsert: () => Promise.resolve({ error: { message: "Supabase URL/Key is not configured" } }),
          insert: () => Promise.resolve({ error: { message: "Supabase URL/Key is not configured" } }),
          delete: () => ({ neq: () => Promise.resolve({ error: { message: "Supabase URL/Key is not configured" } }) }),
          neq: () => dummyQuery,
          eq: () => dummyQuery,
          order: () => dummyQuery,
          limit: () => dummyQuery
        };
        if (prop === 'from') return dummyQuery;
        return undefined;
      };
    }
    try {
      const client = createClient(SUPABASE_URL, ACTUAL_KEY);
      const val = Reflect.get(client, prop);
      if (typeof val === 'function') {
        return val.bind(client);
      }
      return val;
    } catch (e) {
      console.error("Failed to create live Supabase client:", e);
      return undefined;
    }
  }
});

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'request';
  message: string;
  duration?: number;
  data?: any;
}

export function SupabasePlaybook() {
  const [activeTab, setActiveTab] = useState<'sql' | 'nextjs' | 'sandbox'>('sql');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Supabase Playbook & Live Sandbox loaded.',
      data: { url: SUPABASE_URL }
    }
  ]);

  // Next.js 15 Codebase File Explorer States
  const [selectedFile, setSelectedFile] = useState<string>('lib/supabase/server.ts');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'lib': true,
    'lib/supabase': true,
    'app': true,
    'app/login': true,
    'app/dashboard': true
  });

  // Sandbox States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Todo States
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isTodoLoading, setIsTodoLoading] = useState(false);

  // Storage States
  const [selectedFileToUpload, setSelectedFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState('avatars');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to add logs
  const addLog = (type: LogEntry['type'], message: string, data?: any, duration?: number) => {
    setLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
        data,
        duration
      },
      ...prev
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'Logs cleared.');
  };

  // Handle Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Sync session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await liveSupabaseClient.auth.getSession();
      if (session) {
        setUser(session.user);
        addLog('success', `Active session restored for: ${session.user.email}`, session.user);
        fetchProfile(session.user.id);
        fetchTodos();
      } else if (error) {
        addLog('error', 'Error restoring session: ' + error.message, error);
      }
    };
    checkSession();

    // Listen to Auth State Changes
    const { data: { subscription } } = liveSupabaseClient.auth.onAuthStateChange((event: string, session: any) => {
      addLog('info', `Auth event triggered: ${event}`, session);
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setTodos([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch Profile from public profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const start = performance.now();
      const { data, error } = await liveSupabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Failed to fetch profile (check if profiles table & RLS policies exist!): ${error.message}`, error, duration);
      } else {
        setProfile(data);
        addLog('success', 'Profile fetched successfully from [profiles] table', data, duration);
      }
    } catch (err: any) {
      addLog('error', 'Profile query threw an error: ' + err.message);
    }
  };

  // Authentication: Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsAuthLoading(true);
    addLog('request', `Signing up new user: ${email}...`);
    const start = performance.now();

    try {
      const { data, error } = await liveSupabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || 'Demo User',
            avatar_url: ''
          }
        }
      });

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Sign up failed: ${error.message}`, error, duration);
      } else {
        addLog('success', `Sign up initiated! Check your inbox if email confirmation is enabled, or explore the sandbox.`, data, duration);
        setUser(data.user);
        if (data.user) {
          fetchProfile(data.user.id);
          fetchTodos();
        }
      }
    } catch (err: any) {
      addLog('error', 'Sign up execution error: ' + err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Authentication: Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsAuthLoading(true);
    addLog('request', `Signing in user: ${email}...`);
    const start = performance.now();

    try {
      const { data, error } = await liveSupabaseClient.auth.signInWithPassword({
        email,
        password
      });

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Sign in failed: ${error.message}`, error, duration);
      } else {
        addLog('success', `Signed in successfully as ${data.user?.email}!`, data, duration);
        setUser(data.user);
        if (data.user) {
          fetchProfile(data.user.id);
          fetchTodos();
        }
      }
    } catch (err: any) {
      addLog('error', 'Sign in execution error: ' + err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Authentication: Log Out
  const handleSignOut = async () => {
    setIsAuthLoading(true);
    addLog('request', 'Signing out...');
    const start = performance.now();

    try {
      const { error } = await liveSupabaseClient.auth.signOut();
      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Sign out failed: ${error.message}`, error, duration);
      } else {
        setUser(null);
        setProfile(null);
        setTodos([]);
        addLog('success', 'Logged out successfully.', null, duration);
      }
    } catch (err: any) {
      addLog('error', 'Sign out execution error: ' + err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Live CRUD: Fetch Todos
  const fetchTodos = async () => {
    setIsTodoLoading(true);
    addLog('request', 'Fetching records from [todos] table...');
    const start = performance.now();

    try {
      const { data, error } = await liveSupabaseClient
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Fetch Todos failed (ensure you ran the SQL Setup and are logged in!): ${error.message}`, error, duration);
      } else {
        setTodos(data || []);
        addLog('success', `Fetched ${data?.length || 0} todos from database!`, data, duration);
      }
    } catch (err: any) {
      addLog('error', 'Fetch todos threw error: ' + err.message);
    } finally {
      setIsTodoLoading(false);
    }
  };

  // Live CRUD: Insert Todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !user) return;
    addLog('request', `Adding todo: "${newTodoTitle}"...`);
    const start = performance.now();

    try {
      const { data, error } = await liveSupabaseClient
        .from('todos')
        .insert([
          { 
            title: newTodoTitle.trim(), 
            is_complete: false,
            user_id: user.id
          }
        ])
        .select();

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Add Todo failed: ${error.message}`, error, duration);
      } else {
        setNewTodoTitle('');
        addLog('success', 'Todo inserted successfully!', data, duration);
        fetchTodos(); // Refresh list
      }
    } catch (err: any) {
      addLog('error', 'Add todo threw error: ' + err.message);
    }
  };

  // Live CRUD: Toggle Todo Status (Update)
  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    addLog('request', `Toggling todo ID [${id}] status to ${!currentStatus}...`);
    const start = performance.now();

    try {
      const { data, error } = await liveSupabaseClient
        .from('todos')
        .update({ is_complete: !currentStatus })
        .eq('id', id)
        .select();

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Toggle Todo failed: ${error.message}`, error, duration);
      } else {
        addLog('success', 'Todo updated successfully!', data, duration);
        setTodos(todos.map(t => t.id === id ? { ...t, is_complete: !currentStatus } : t));
      }
    } catch (err: any) {
      addLog('error', 'Toggle todo threw error: ' + err.message);
    }
  };

  // Live CRUD: Delete Todo
  const handleDeleteTodo = async (id: string) => {
    addLog('request', `Deleting todo ID [${id}]...`);
    const start = performance.now();

    try {
      const { error } = await liveSupabaseClient
        .from('todos')
        .delete()
        .eq('id', id);

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `Delete Todo failed: ${error.message}`, error, duration);
      } else {
        addLog('success', 'Todo deleted successfully from DB!', null, duration);
        setTodos(todos.filter(t => t.id !== id));
      }
    } catch (err: any) {
      addLog('error', 'Delete todo threw error: ' + err.message);
    }
  };

  // Live Storage: Upload File
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileToUpload || !user) return;
    setIsUploading(true);
    addLog('request', `Uploading file "${selectedFileToUpload.name}" to storage bucket "${bucketName}"...`);
    const start = performance.now();

    try {
      const fileExt = selectedFileToUpload.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await liveSupabaseClient.storage
        .from(bucketName)
        .upload(fileName, selectedFileToUpload, {
          cacheControl: '3600',
          upsert: true
        });

      const duration = Math.round(performance.now() - start);

      if (error) {
        addLog('error', `File upload failed (make sure bucket "${bucketName}" exists and RLS allows uploads!): ${error.message}`, error, duration);
      } else {
        const { data: { publicUrl } } = liveSupabaseClient.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        setUploadedUrl(publicUrl);
        setSelectedFileToUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        addLog('success', 'File uploaded successfully! Public link generated.', { data, publicUrl }, duration);

        // Try updating user profile with avatar_url
        if (bucketName === 'avatars' && profile) {
          addLog('info', 'Attempting to link avatar URL to user profile...');
          await liveSupabaseClient
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);
          fetchProfile(user.id);
        }
      }
    } catch (err: any) {
      addLog('error', 'File upload threw error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // File explorer node toggle
  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  return (
    <section className="bg-slate-950 text-slate-100 rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wide border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Supabase 2026 Developer Console</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight font-serif text-white">
            Next.js 15 Integration Center
          </h2>
          <p className="text-slate-400 text-sm font-sans max-w-2xl font-light">
            Buat pengembang senior Next.js 15 dengan App Router, SSR, TypeScript, Row Level Security (RLS) serta validasi sandbox secara langsung.
          </p>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start md:self-center">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sql' 
                ? 'bg-emerald-500 text-slate-950 shadow-lg font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. SQL & RLS</span>
          </button>
          <button
            onClick={() => setActiveTab('nextjs')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'nextjs' 
                ? 'bg-emerald-500 text-slate-950 shadow-lg font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. Next.js 15 Files</span>
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sandbox' 
                ? 'bg-emerald-500 text-slate-950 shadow-lg font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. Live Sandbox</span>
          </button>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="relative z-10 min-h-[500px]">
        
        {/* TAB 1: SQL SCHEMA */}
        {activeTab === 'sql' && (
          <PlaybookSqlSetup 
            sqlSnippets={sqlSnippets}
            copiedText={copiedText}
            handleCopy={handleCopy}
          />
        )}

        {/* TAB 2: NEXTJS 15 CODEBASE FILES */}
        {activeTab === 'nextjs' && (
          <PlaybookNextjsIntegration 
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            fileContent={fileContent}
            copiedText={copiedText}
            handleCopy={handleCopy}
          />
        )}

        {/* TAB 3: LIVE SANDBOX PLAYGROUND */}
        {activeTab === 'sandbox' && (
          <PlaybookSandbox 
            user={user}
            profile={profile}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isAuthLoading={isAuthLoading}
            handleSignIn={handleSignIn}
            handleSignUp={handleSignUp}
            handleSignOut={handleSignOut}
            bucketName={bucketName}
            setBucketName={setBucketName}
            selectedFileToUpload={selectedFileToUpload}
            setSelectedFileToUpload={setSelectedFileToUpload}
            fileInputRef={fileInputRef}
            isUploading={isUploading}
            handleFileUpload={handleFileUpload}
            uploadedUrl={uploadedUrl}
            fetchTodos={fetchTodos}
            isTodoLoading={isTodoLoading}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            handleAddTodo={handleAddTodo}
            todos={todos}
            handleToggleTodo={handleToggleTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}

      </div>

      {/* FOOTER TERMINAL LOGS CONSOLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
        {/* Terminal Header */}
        <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase ml-2 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Real-time API Logs</span>
            </span>
          </div>

          <button 
            onClick={clearLogs}
            className="text-[10px] hover:text-white text-slate-500 font-mono border border-slate-800 hover:bg-slate-850 px-2.5 py-1 rounded cursor-pointer"
          >
            Clear Console
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-2.5 bg-slate-950/80">
          {logs.map((log, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`font-extrabold uppercase shrink-0 select-none text-[10px] px-1.5 py-0.5 rounded ${
                  log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  log.type === 'error' ? 'bg-rose-500/10 text-rose-400' :
                  log.type === 'request' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {log.type}
                </span>
                <span className={`flex-1 ${log.type === 'error' ? 'text-rose-300' : log.type === 'success' ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {log.message}
                </span>
                {log.duration && (
                  <span className="text-[10px] text-slate-500 shrink-0 font-light">{log.duration}ms</span>
                )}
              </div>
              
              {/* Optional JSON Payload Expandable */}
              {log.data && (
                <div className="pl-24">
                  <pre className="text-[10px] text-slate-500 border-l border-slate-850 pl-2 max-h-24 overflow-y-auto leading-tight select-all">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// SQL Script Snippets
const sqlSnippets = {
  fullSetup: `-- ==========================================
-- 🛠️ DATABASE SCHEMA & SETUP FOR PENO HOMESTAY
-- Paste this script directly in your Supabase SQL Editor
-- ==========================================

-- 1. Create [peno_bookings] table
create table if not exists peno_bookings (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'pending',
  check_in timestamp with time zone not null,
  check_out timestamp with time zone not null,
  nights integer not null,
  total_eur numeric not null,
  guest_name text not null,
  guest_email text not null,
  guest_wa text not null,
  guest_count integer not null default 1,
  notes text
);

-- 2. Create [peno_blocked] table
create table if not exists peno_blocked (
  date_str text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create [peno_cms] table
create table if not exists peno_cms (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS) on all tables
alter table peno_bookings enable row level security;
alter table peno_blocked enable row level security;
alter table peno_cms enable row level security;

-- ==========================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- 5. peno_bookings Policies:
create policy "Allow anyone to view bookings"
  on peno_bookings for select
  using (true);

create policy "Allow anyone to insert bookings"
  on peno_bookings for insert
  with check (true);

create policy "Allow anyone to update bookings"
  on peno_bookings for update
  using (true);

create policy "Allow anyone to delete bookings"
  on peno_bookings for delete
  using (true);

-- 6. peno_blocked Policies:
create policy "Allow anyone to view blocked dates"
  on peno_blocked for select
  using (true);

create policy "Allow anyone to insert blocked dates"
  on peno_blocked for insert
  with check (true);

create policy "Allow anyone to delete blocked dates"
  on peno_blocked for delete
  using (true);

-- 7. peno_cms Policies:
create policy "Allow anyone to view CMS contents"
  on peno_cms for select
  using (true);

create policy "Allow anyone to insert/update CMS contents"
  on peno_cms for insert
  with check (true);

create policy "Allow anyone to update CMS contents"
  on peno_cms for update
  using (true);`,
  storageSetup: `-- ==========================================
-- 📦 SUPABASE STORAGE PUBLIC BUCKET SETUP
-- Run this to configure the 'avatars' storage bucket
-- and allow public uploads/management.
-- ==========================================

-- 1. Create public 'avatars' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Storage Policies for Avatars bucket

-- Read Access: Anyone can read/download avatar/gallery files
create policy "Public files are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Insert Access: Anyone can upload files to 'avatars'
create policy "Anyone can upload to avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars');

-- Update Access: Anyone can update files in 'avatars'
create policy "Anyone can update avatars"
  on storage.objects for update
  using (bucket_id = 'avatars');

-- Delete Access: Anyone can delete files in 'avatars'
create policy "Anyone can delete avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars');`
};

// Next.js 15 Files Catalog
const fileContent: Record<string, string> = {
  'package.json': `{
  "name": "next15-supabase-demo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.48.0",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "typescript": "^5.7.2",
    "tailwindcss": "^4.0.0"
  }
}`,
  '.env.local': `# Supabase Environment Variables
# Get these from your Supabase Dashboard under Project Settings > API

NEXT_PUBLIC_SUPABASE_URL=https://njgsafkwldootsupwjsb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...IbFv2u31EMjMfvRYoLMLG4Fvukp3c7NL_PWYnTBvFNQ`,

  'lib/supabase/client.ts': `import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for Client Components (runs in the browser).
 * Uses standard singleton pattern safe for React 19 and hot module reloading.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}`,

  'lib/supabase/server.ts': `import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * CRITICAL 2026 BEST PRACTICE: In Next.js 15, cookies() is asynchronous!
 * We await cookies() first, then pass custom getters and setters to match SSG/SSR state.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // NOTE: The \`setAll\` method can throw an error if called from a
            // Server Component. In Next.js, this is fine because Middleware
            // handles refreshing sessions anyway. Safe to ignore.
          }
        },
      },
    }
  )
}`,

  'middleware.ts': `import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase Auth Session Refresher Middleware.
 * Updates user session cookie on every request so the login remains active.
 * Protects routes by checking for user authentication.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Create standard SSR server client inside middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Fetch current user. Do NOT use getUser() inside performance loops unless necessary,
  // but it's the safest way to validate cookies.
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Protected Route Management
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  if (isDashboardRoute && !user) {
    // If attempting to access dashboard but guest, redirect to Login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && user) {
    // If logged in but visiting login page, redirect to Dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}`
};
