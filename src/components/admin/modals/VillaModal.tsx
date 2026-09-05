import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ImageIcon, Upload, Check, RefreshCw, Save } from 'lucide-react';

interface VillaModalProps {
  showVillaModal: boolean;
  onClose: () => void;
  editingVilla: any;
  villaTitle: string;
  setVillaTitle: (val: string) => void;
  villaCapacity: number;
  setVillaCapacity: (val: number) => void;
  villaIncludeBreakfast: boolean;
  setVillaIncludeBreakfast: (val: boolean) => void;
  villaRoomCode: string;
  setVillaRoomCode: (val: string) => void;
  villaPricePerPax: number;
  setVillaPricePerPax: (val: number) => void;
  villaDescription: string;
  setVillaDescription: (val: string) => void;
  activeVillaTab: 'upload' | 'url';
  setActiveVillaTab: (val: 'upload' | 'url') => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  villaImageUrl: string;
  setVillaImageUrl: (val: string) => void;
  selectedImageFile: File | null;
  setSelectedImageFile: (file: File | null) => void;
  uploadError: string | null;
  saveStatus: 'idle' | 'saving' | 'saved';
  handleSaveVilla: (e: React.FormEvent) => void;
}

export const VillaModal: React.FC<VillaModalProps> = ({
  showVillaModal,
  onClose,
  editingVilla,
  villaTitle,
  setVillaTitle,
  villaCapacity,
  setVillaCapacity,
  villaIncludeBreakfast,
  setVillaIncludeBreakfast,
  villaRoomCode,
  setVillaRoomCode,
  villaPricePerPax,
  setVillaPricePerPax,
  villaDescription,
  setVillaDescription,
  activeVillaTab,
  setActiveVillaTab,
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileSelectChange,
  villaImageUrl,
  setVillaImageUrl,
  selectedImageFile,
  setSelectedImageFile,
  uploadError,
  saveStatus,
  handleSaveVilla
}) => {
  return (
    <AnimatePresence>
      {showVillaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 md:p-7 max-w-3xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-2">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-green-deep text-left">
                {editingVilla ? "Ubah Villa / Kamar" : "Tambah Villa / Kamar"}
              </h3>
            </div>

            <form onSubmit={handleSaveVilla} className="space-y-4 font-sans text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Form Details */}
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-text-dark">Nama / Judul Villa / Kamar</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Villa Arabica Deluxe View Kebun Kopi"
                      value={villaTitle}
                      onChange={(e) => setVillaTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2.5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Kapasitas (Pax / Orang)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={100}
                        value={villaCapacity}
                        onChange={(e) => setVillaCapacity(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2.5 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Fasilitas Sarapan (Breakfast)</label>
                      <select
                        value={villaIncludeBreakfast ? "yes" : "no"}
                        onChange={(e) => setVillaIncludeBreakfast(e.target.value === "yes")}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2.5 rounded-xl text-xs cursor-pointer"
                      >
                        <option value="yes">Termasuk Sarapan (Yes)</option>
                        <option value="no">Tanpa Sarapan (No)</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Kode Kamar (ROOM Code)</label>
                      <input
                        type="text"
                        placeholder="Contoh: 3"
                        value={villaRoomCode}
                        onChange={(e) => setVillaRoomCode(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-green-deep"
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-text-dark">Harga Sewa Per Malam (K IDR)</label>
                    <div className="relative text-left">
                      <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-green-soft">Rp</span>
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="Contoh: 150"
                        value={villaPricePerPax}
                        onChange={(e) => setVillaPricePerPax(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold text-green-deep"
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-0.5">Harga sewa per malam dalam ribuan Rupiah (Contoh: tulis 150 untuk Rp 150.000 atau 150K).</p>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-text-dark">Deskripsi Villa / Kamar</label>
                    <textarea
                      rows={4}
                      placeholder="Berikan gambaran lengkap tipe villa/kamar, ranjang, pemandangan kebun kopi, atau amenitas eksklusif lainnya..."
                      value={villaDescription}
                      onChange={(e) => setVillaDescription(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Right Column: Image Selection */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="text-[11px] font-bold text-text-dark block mb-1">Gambar Media Villa</label>
                    
                    {/* Image Preview Area */}
                    <div className="h-36 rounded-2xl border border-dashed border-gray-200 bg-gray-50 overflow-hidden relative flex items-center justify-center mb-3">
                      {villaImageUrl ? (
                        <div className="w-full h-full relative group">
                          <img
                            src={villaImageUrl}
                            alt="Pratinjau Villa"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button
                              type="button"
                              onClick={() => setVillaImageUrl("")}
                              className="px-3 py-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-lg shadow cursor-pointer"
                            >
                              Hapus Media
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto stroke-1" />
                          <p className="text-[10px] text-gray-400 font-light mt-1.5">Belum ada pratinjau gambar</p>
                        </div>
                      )}
                    </div>

                    {/* Tab Buttons for URL vs Upload */}
                    <div className="flex border-b border-gray-100 pb-2 mb-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveVillaTab('upload')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          activeVillaTab === 'upload' ? 'bg-green-soft text-cream' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Unggah Berkas
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveVillaTab('url')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          activeVillaTab === 'url' ? 'bg-green-soft text-cream' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Tautan Gambar / URL
                      </button>
                    </div>

                    {/* Tab Content */}
                    {activeVillaTab === 'upload' ? (
                      <div className="space-y-2">
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-5 rounded-xl border border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            dragActive 
                              ? 'border-green-soft bg-green-50/10' 
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100/70'
                          }`}
                        >
                          <Upload className="w-6 h-6 text-green-soft mb-1.5 stroke-1" />
                          <p className="text-[10px] font-bold text-gray-500">
                            {dragActive ? 'Lepaskan gambar di sini' : 'Klik atau seret gambar ke sini'}
                          </p>
                          <p className="text-[8px] text-gray-400 font-light mt-0.5">Mendukung JPEG, PNG, WEBP, GIF</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelectChange}
                            className="hidden"
                          />
                        </div>

                        {uploadError && (
                          <p className="text-[9px] text-rose-500 bg-rose-50/60 border border-rose-100 p-2 rounded-xl leading-relaxed text-left">
                            {uploadError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-text-dark">Tautan Gambar (HTTP Link)</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/photo-1540555700478-4be289fbecef"
                          value={villaImageUrl}
                          onChange={(e) => setVillaImageUrl(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2.5 rounded-xl text-xs font-mono"
                        />
                        <p className="text-[9px] text-gray-400 leading-relaxed mt-1 font-light">
                          Gunakan URL eksternal atau salin link dari internet untuk memuat media secara praktis.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Bar: Action buttons */}
              <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveStatus !== 'idle'}
                  className="px-5 py-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold rounded-xl transition-all shadow text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersimpan</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
