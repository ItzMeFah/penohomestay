import React from 'react';
import { Save, Check, RefreshCw } from 'lucide-react';

interface AdminSettingsGeneralProps {
  setHomestayName: string;
  setSetHomestayName: (val: string) => void;
  setTagline: string;
  setSetTagline: (val: string) => void;
  setWa: string;
  setSetWa: (val: string) => void;
  setInsta: string;
  setSetInsta: (val: string) => void;
  setAddress: string;
  setSetAddress: (val: string) => void;
  setMaps: string;
  setSetMaps: (val: string) => void;
  setPrice: number;
  setSetPrice: (val: number) => void;
  setHeroOverlayOpacity: number;
  setSetHeroOverlayOpacity: (val: number) => void;
  setInTime: string;
  setSetInTime: (val: string) => void;
  setOutTime: string;
  setSetOutTime: (val: string) => void;
  setAdminUser: string;
  setSetAdminUser: (val: string) => void;
  setAdminPass: string;
  setSetAdminPass: (val: string) => void;
  showAdminPass: boolean;
  setShowAdminPass: (val: boolean) => void;
  dbUrl: string;
  setDbUrl: (val: string) => void;
  dbKey: string;
  setDbKey: (val: string) => void;
  showDbKey: boolean;
  setShowDbKey: (val: boolean) => void;
  supabaseStatus: 'checking' | 'connected' | 'disconnected';
  saveStatus: 'idle' | 'saving' | 'saved';
  handleSaveSettings: (e: React.FormEvent) => void;
}

export const AdminSettingsGeneral: React.FC<AdminSettingsGeneralProps> = ({
  setHomestayName,
  setSetHomestayName,
  setTagline,
  setSetTagline,
  setWa,
  setSetWa,
  setInsta,
  setSetInsta,
  setAddress,
  setSetAddress,
  setMaps,
  setSetMaps,
  setPrice,
  setSetPrice,
  setHeroOverlayOpacity,
  setSetHeroOverlayOpacity,
  setInTime,
  setSetInTime,
  setOutTime,
  setSetOutTime,
  setAdminUser,
  setSetAdminUser,
  setAdminPass,
  setSetAdminPass,
  showAdminPass,
  setShowAdminPass,
  dbUrl,
  setDbUrl,
  dbKey,
  setDbKey,
  showDbKey,
  setShowDbKey,
  supabaseStatus,
  saveStatus,
  handleSaveSettings
}) => {
  return (
    <div id="admin-settings-general-panel" className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <h3 className="font-serif text-xl font-bold text-green-deep border-b border-gray-100 pb-4 mb-6">
        Pengaturan Umum Homestay & Kredensial Admin
      </h3>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Nama Homestay</label>
            <input
              type="text"
              required
              value={setHomestayName}
              onChange={(e) => setSetHomestayName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Tagline Utama</label>
            <input
              type="text"
              required
              value={setTagline}
              onChange={(e) => setSetTagline(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Nomor WhatsApp Bisnis</label>
            <input
              type="text"
              required
              placeholder="+62 812-3380-0631"
              value={setWa}
              onChange={(e) => setSetWa(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Instagram Handle</label>
            <input
              type="text"
              required
              placeholder="@penohomestaybanyuwangi"
              value={setInsta}
              onChange={(e) => setSetInsta(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Alamat Lengkap</label>
            <textarea
              rows={2}
              required
              value={setAddress}
              onChange={(e) => setSetAddress(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm font-sans"
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Google Maps Share URL Link</label>
            <input
              type="text"
              required
              value={setMaps}
              onChange={(e) => setSetMaps(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Pricing / Times */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Harga Dasar Per Malam (K IDR)</label>
            <input
              type="number"
              required
              value={setPrice}
              onChange={(e) => setSetPrice(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dark">Hero Slider Image Opacity (%)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={setHeroOverlayOpacity}
              onChange={(e) => setSetHeroOverlayOpacity(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
            />
            <p className="text-[10px] text-gray-400">0% = Transparan penuh, 100% = Foto jelas (overlay gelap hilang)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dark">Check-In</label>
              <input
                type="text"
                required
                value={setInTime}
                onChange={(e) => setSetInTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm text-center"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dark">Check-Out</label>
              <input
                type="text"
                required
                value={setOutTime}
                onChange={(e) => setSetOutTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm text-center"
              />
            </div>
          </div>

          {/* KREDENSIAL */}
          <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-6 mt-2 space-y-4">
            <h4 className="font-serif text-base font-bold text-green-deep">Kredensial Autentikasi Admin</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark">Username Admin Portal</label>
                <input
                  type="text"
                  required
                  value={setAdminUser}
                  onChange={(e) => setSetAdminUser(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark flex justify-between">
                  <span>Password Admin Portal</span>
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="text-green-soft hover:text-green-deep text-[10px] cursor-pointer"
                  >
                    {showAdminPass ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </label>
                <input
                  type={showAdminPass ? "text" : "password"}
                  required
                  value={setAdminPass}
                  onChange={(e) => setSetAdminPass(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* SUPABASE INTEGRASI */}
          <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-6 mt-2 space-y-4">
            <div className="flex items-center space-x-2">
              <h4 className="font-serif text-base font-bold text-green-deep">Integrasi & Kredensial Supabase</h4>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-all ${
                supabaseStatus === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : supabaseStatus === 'checking' 
                    ? 'bg-amber-100 text-amber-800 animate-pulse' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {supabaseStatus === 'connected' ? 'Connected' : supabaseStatus === 'checking' ? 'Checking...' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Konfigurasikan URL dan Anon Key Supabase di bawah ini untuk mengaktifkan sinkronisasi database cloud (Booking, CMS, Galeri, dll). 
              Kredensial disimpan secara aman di <strong>browser Local Storage Anda</strong> untuk mencegah kebocoran/exposure di file bundel JavaScript produksi (F12 Sources).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark">Supabase URL</label>
                <input
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark flex justify-between">
                  <span>Supabase Anon Key</span>
                  <button
                    type="button"
                    onClick={() => setShowDbKey(!showDbKey)}
                    className="text-green-soft hover:text-green-deep text-[10px] font-bold cursor-pointer"
                  >
                    {showDbKey ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </label>
                <input
                  type={showDbKey ? "text" : "password"}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                  value={dbKey}
                  onChange={(e) => setDbKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={saveStatus !== 'idle'}
          className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-8 py-3 rounded-full shadow cursor-pointer text-sm transition-all hover:-translate-y-0.5 active:scale-95"
        >
          {saveStatus === 'saving' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
