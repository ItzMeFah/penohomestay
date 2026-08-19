import React from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

interface AdminAuthGateProps {
  handleLogin: (e: React.FormEvent) => void;
  usernameInput: string;
  setUsernameInput: (val: string) => void;
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  loginError: string;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  handleLogin,
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  showPassword,
  setShowPassword,
  loginError
}) => {
  return (
    <div id="admin-auth-gate" className="fixed inset-0 bg-green-deep flex items-center justify-center p-6 z-50 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-green-soft/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-coffee/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-sand/30 p-8 md:p-12 max-w-md w-full shadow-2xl space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-green-deep">Peno Homestay</h2>
          <p className="font-sans text-sm text-text-mid font-light">Admin Portal Login Gate</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="font-sans text-xs font-semibold uppercase text-text-dark tracking-wider">Username</label>
            <input
              id="auth-username"
              type="text"
              required
              placeholder="Masukkan username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="font-sans text-xs font-semibold uppercase text-text-dark tracking-wider flex justify-between">
              <span>Password</span>
              <button
                id="auth-toggle-password"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-green-soft hover:text-green-deep normal-case text-[10px] font-sans"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </label>
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Masukkan password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
            />
          </div>

          {loginError && (
            <div id="auth-error-box" className="bg-rose-50 text-rose-700 text-xs font-sans font-medium p-3 border border-rose-100 rounded-xl">
              {loginError}
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full bg-green-deep hover:bg-green-mid text-cream font-sans font-semibold py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer text-center flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Masuk Portal Admin</span>
          </button>
        </form>

        <div className="text-center font-mono text-[10px] text-gray-400 uppercase tracking-widest pt-4">
          Security Authenticator Gate
        </div>
      </motion.div>
    </div>
  );
};
