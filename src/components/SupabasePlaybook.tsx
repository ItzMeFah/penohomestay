import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Code2, Terminal, Copy, Check, Folder, FileCode, ChevronRight, 
  User, ListPlus, Upload, ShieldCheck, KeyRound, RefreshCw, LogIn, UserPlus,
  LogOut, Trash2, CheckCircle, Circle, AlertCircle, FileText, Settings, Key, Info
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// User's actual Supabase credentials for live sandbox testing
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://eszvodingaehsnahsvmb.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzenZvZGluZ2FlaHNuYWhzdm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDc3NDQsImV4cCI6MjA5ODIyMzc0NH0.UpoFJqht-1pybKBeadMctnIgI3PmiPMsqWU9uJnfy1Q";
const ACTUAL_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzenZvZGluZ2FlaHNuYWhzdm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDc3NDQsImV4cCI6MjA5ODIyMzc0NH0.UpoFJqht-1pybKBeadMctnIgI3PmiPMsqWU9uJnfy1Q";

// Initialize the live sandbox Supabase client
const liveSupabaseClient = createClient(SUPABASE_URL, ACTUAL_KEY);

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
    const { data: { subscription } } = liveSupabaseClient.auth.onAuthStateChange((event, session) => {
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

NEXT_PUBLIC_SUPABASE_URL=https://eszvodingaehsnahsvmb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...UpoFJqht-1pybKBeadMctnIgI3PmiPMsqWU9uJnfy1Q`,

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
}`,

    'app/login/page.tsx': `import { handleLogin, handleSignUp } from './actions'

/**
 * Next.js 15 Login/Registration Page.
 * Server Component containing standard form that executes modern Server Actions.
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Supabase Auth Hub</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your account or register a new one</p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            <div>
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              formAction={handleLogin}
              className="w-1/2 rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
            >
              Sign In
            </button>
            <button
              formAction={handleSignUp}
              className="w-1/2 rounded-lg border border-slate-300 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}`,

    'app/login/actions.ts': `'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Server Actions for handling Authentication in Next.js 15
 */

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=' + encodeURIComponent(error.message))
  }

  return redirect('/dashboard')
}

export async function handleSignUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: \`\${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback\`,
    }
  })

  if (error) {
    return redirect('/login?message=' + encodeURIComponent(error.message))
  }

  return redirect('/login?message=Registration successful! Please confirm your email.')
}`,

    'app/dashboard/page.tsx': `import { createClient } from '@/lib/supabase/server'
import TodoList from './todo-list'
import { createTodo, deleteTodo, toggleTodo } from './actions'

/**
 * Next.js 15 Protected Dashboard (Server Component).
 * Fetches user profile and records directly from database.
 * Passes functions as direct server action props or uses a Client Component (\`TodoList\`)
 * to handle fluid user experience.
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  
  // 1. Fetch authenticated user safely on the server
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null // Handled by middleware redirect, but keeps types clean
  }

  // 2. Fetch Profile record
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Fetch user's Todos
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-md border border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Welcome back, {profile?.full_name || user.email}!</h1>
            <p className="text-sm text-slate-500">Secure user dashboard loaded directly from the server.</p>
          </div>
          
          <form action="/api/auth/signout" method="POST">
            <button className="rounded-lg bg-red-50 text-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-100 transition">
              Sign Out
            </button>
          </form>
        </div>

        {/* Live Client component containing todo list details */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Your Task List</h2>
          <TodoList 
            initialTodos={todos || []} 
            createTodoAction={createTodo}
            toggleTodoAction={toggleTodo}
            deleteTodoAction={deleteTodo}
          />
        </div>
      </div>
    </div>
  )
}`,

    'app/dashboard/todo-list.tsx': `'use client'

import { useState, useTransition } from 'react'

interface Todo {
  id: string
  title: string
  is_complete: boolean
}

interface TodoListProps {
  initialTodos: Todo[]
  createTodoAction: (title: string) => Promise<{ success: boolean; error?: string }>
  toggleTodoAction: (id: string, current: boolean) => Promise<{ success: boolean; error?: string }>
  deleteTodoAction: (id: string) => Promise<{ success: boolean; error?: string }>
}

/**
 * Next.js 15 Client Component.
 * Receives original data from Server Component and applies optimistic or local state.
 * Triggers Server Actions using react transitions (\`useTransition\`) to prevent lagging loads.
 */
export default function TodoList({ 
  initialTodos, 
  createTodoAction, 
  toggleTodoAction, 
  deleteTodoAction 
}: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTitle, setNewTitle] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const tempTitle = newTitle
    setNewTitle('')

    startTransition(async () => {
      const result = await createTodoAction(tempTitle)
      if (result.success) {
        // Optimistically reload or allow server state to sync
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  const handleToggle = (id: string, current: boolean) => {
    // Optimistic toggle
    setTodos(prev => prev.map(t => t.id === id ? { ...t, is_complete: !current } : t))
    
    startTransition(async () => {
      const result = await toggleTodoAction(id, current)
      if (!result.success) {
        // Revert on error
        setTodos(prev => prev.map(t => t.id === id ? { ...t, is_complete: current } : t))
        alert(result.error)
      }
    })
  }

  const handleDelete = (id: string) => {
    // Optimistic delete
    const previous = todos
    setTodos(prev => prev.filter(t => t.id !== id))

    startTransition(async () => {
      const result = await deleteTodoAction(id)
      if (!result.success) {
        setTodos(previous)
        alert(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-900 text-white px-6 py-2.5 font-bold hover:bg-slate-800 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Add'}
        </button>
      </form>

      <ul className="divide-y divide-slate-100">
        {todos.length === 0 ? (
          <p className="py-4 text-center text-slate-400 text-sm">No tasks found. Create one above!</p>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between py-4">
              <button 
                onClick={() => handleToggle(todo.id, todo.is_complete)}
                className="flex items-center space-x-3 text-left"
              >
                <span className={\`h-5 w-5 rounded-full border flex items-center justify-center transition \${
                  todo.is_complete ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                }\`}>
                  {todo.is_complete && '✓'}
                </span>
                <span className={\`text-sm font-medium \${
                  todo.is_complete ? 'line-through text-slate-400' : 'text-slate-700'
                }\`}>
                  {todo.title}
                </span>
              </button>

              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-100 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
              >
                🗑️
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}`,

    'app/dashboard/actions.ts': `'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Server Actions for executing direct, authenticated CRUD operations in Next.js 15
 */

export async function createTodo(title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User is not authenticated' }
  }

  const { error } = await supabase
    .from('todos')
    .insert([{ title, user_id: user.id }])

  if (error) {
    return { success: false, error: error.message }
  }

  // Revalidate the Next.js cache for the dashboard path to fetch fresh data
  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleTodo(id: string, current: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('todos')
    .update({ is_complete: !current })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteTodo(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}`
  };

  const currentFileCode = fileContent[selectedFile] || '';

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
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
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
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
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
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
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
                  className="flex items-center space-x-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition"
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
                  className="flex items-center space-x-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition"
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
        )}

        {/* TAB 2: NEXTJS 15 CODEBASE FILES */}
        {activeTab === 'nextjs' && (
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
                  className="flex items-center space-x-1 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition"
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
        )}

        {/* TAB 3: LIVE SANDBOX PLAYGROUND */}
        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Control Panel (Col 5) */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              
              {/* Authentication Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  <span>Autentikasi Pengguna</span>
                </h3>

                {!user ? (
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                    <p className="text-xs text-slate-400 font-sans font-light">
                      Masukkan email dan password untuk membuat user baru atau login ke Supabase secara langsung.
                    </p>
                    
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-1">Nama Lengkap (Hanya Sign-up)</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Pak Peno"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2.5 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-1">Alamat Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2.5 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2.5 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleSignIn}
                        disabled={isAuthLoading}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSignUp}
                        disabled={isAuthLoading}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Sign Up</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
                      <div className="flex items-center space-x-3">
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border-2 border-emerald-500/40">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-white block truncate">{profile?.full_name || 'Authenticated User'}</span>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">{user.email}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 block">UID STATUS</span>
                          <span className="text-emerald-400">ACTIVE</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">ROLE</span>
                          <span className="text-slate-300">AUTHENTICATED</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSignOut}
                      disabled={isAuthLoading}
                      className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Storage Upload Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <span>Unggah Berkas ke Storage</span>
                </h3>

                {!user ? (
                  <p className="text-xs text-slate-400 font-sans font-light bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                    🔒 Silakan masuk atau daftarkan akun terlebih dahulu untuk melakukan upload ke bucket storage.
                  </p>
                ) : (
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-1">Storage Bucket</label>
                      <select 
                        value={bucketName} 
                        onChange={(e) => setBucketName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2.5 focus:border-emerald-500 focus:outline-none text-slate-300"
                      >
                        <option value="avatars">avatars (Tipe: Public)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-1">Pilih File</label>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => setSelectedFileToUpload(e.target.files ? e.target.files[0] : null)}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 file:cursor-pointer"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading || !selectedFileToUpload}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Unggah ke Supabase</span>
                        </>
                      )}
                    </button>

                    {uploadedUrl && (
                      <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-2">
                        <span className="text-[10px] text-emerald-400 font-bold block">✓ File Berhasil Diunggah</span>
                        <a 
                          href={uploadedUrl} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          className="text-[10px] text-cyan-400 truncate block hover:underline"
                        >
                          {uploadedUrl}
                        </a>
                      </div>
                    )}
                  </form>
                )}
              </div>

            </div>

            {/* Todo Live Database CRUD App (Col 7) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                  <ListPlus className="w-5 h-5 text-emerald-400" />
                  <span>Real-time CRUD - Tabel Todo</span>
                </h3>
                
                {user && (
                  <button 
                    onClick={fetchTodos}
                    disabled={isTodoLoading}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-50"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTodoLoading ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>

              {!user ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950/30 rounded-xl border border-dashed border-slate-800 space-y-4 min-h-[300px]">
                  <div className="p-3 bg-slate-850 rounded-full text-slate-500">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-300">Hubungkan Sesi Terlebih Dahulu</h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Silakan login atau mendaftar di panel Autentikasi terlebih dahulu untuk mengaktifkan RLS dan melakukan CRUD data secara live.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4 min-h-[350px]">
                  
                  {/* Form input todo */}
                  <form onSubmit={handleAddTodo} className="flex gap-2">
                    <input
                      type="text"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      placeholder="Tulis list tugas yang mau kamu simpan..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs p-3 focus:border-emerald-500 focus:outline-none text-slate-200"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-sans font-bold text-xs px-5 rounded-lg flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Add Task</span>
                    </button>
                  </form>

                  {/* Todo List viewport */}
                  <div className="flex-1 bg-slate-950 rounded-xl border border-slate-850 overflow-y-auto max-h-[320px] p-2 divide-y divide-slate-850">
                    {todos.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 text-xs">
                        {isTodoLoading ? 'Memuat data...' : 'Tidak ada list tugas ditemukan. Silakan tambahkan tugas di atas!'}
                      </div>
                    ) : (
                      todos.map((todo) => (
                        <div key={todo.id} className="flex items-center justify-between py-3 px-3 hover:bg-slate-900/50 rounded-lg group transition-colors">
                          <button
                            onClick={() => handleToggleTodo(todo.id, todo.is_complete)}
                            className="flex items-center space-x-3 text-left focus:outline-none"
                          >
                            <span className="shrink-0">
                              {todo.is_complete ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                              )}
                            </span>
                            <span className={`text-xs ${todo.is_complete ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {todo.title}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-slate-800 transition-all duration-200"
                            title="Hapus Todo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
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
            className="text-[10px] hover:text-white text-slate-500 font-mono border border-slate-800 hover:bg-slate-850 px-2.5 py-1 rounded"
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
