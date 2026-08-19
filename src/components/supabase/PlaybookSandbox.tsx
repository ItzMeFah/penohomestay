import React from 'react';
import { 
  KeyRound, LogIn, UserPlus, LogOut, Upload, RefreshCw, ListPlus, 
  ShieldCheck, CheckCircle, Circle, Trash2 
} from 'lucide-react';

interface PlaybookSandboxProps {
  user: any;
  profile: any;
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isAuthLoading: boolean;
  handleSignIn: (e: React.FormEvent) => void;
  handleSignUp: (e: React.FormEvent) => void;
  handleSignOut: () => void;
  bucketName: string;
  setBucketName: (v: string) => void;
  selectedFileToUpload: File | null;
  setSelectedFileToUpload: (f: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  handleFileUpload: (e: React.FormEvent) => void;
  uploadedUrl: string | null;
  fetchTodos: () => void;
  isTodoLoading: boolean;
  newTodoTitle: string;
  setNewTodoTitle: (v: string) => void;
  handleAddTodo: (e: React.FormEvent) => void;
  todos: any[];
  handleToggleTodo: (id: string, current: boolean) => void;
  handleDeleteTodo: (id: string) => void;
}

export const PlaybookSandbox: React.FC<PlaybookSandboxProps> = ({
  user,
  profile,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  isAuthLoading,
  handleSignIn,
  handleSignUp,
  handleSignOut,
  bucketName,
  setBucketName,
  selectedFileToUpload,
  setSelectedFileToUpload,
  fileInputRef,
  isUploading,
  handleFileUpload,
  uploadedUrl,
  fetchTodos,
  isTodoLoading,
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  todos,
  handleToggleTodo,
  handleDeleteTodo
}) => {
  return (
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
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-50 cursor-pointer"
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
                      className="flex items-center space-x-3 text-left focus:outline-none cursor-pointer"
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
                      className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-slate-800 transition-all duration-200 cursor-pointer"
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
  );
};
