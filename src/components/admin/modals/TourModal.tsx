import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ImageIcon, Check, RefreshCw, Save } from 'lucide-react';

interface TourModalProps {
  showTourModal: boolean;
  onClose: () => void;
  editingTour: any;
  tourName: string;
  setTourName: (val: string) => void;
  tourPrice: string;
  setTourPrice: (val: string) => void;
  tourPhone: string;
  setTourPhone: (val: string) => void;
  tourSocial: string;
  setTourSocial: (val: string) => void;
  tourDescription: string;
  setTourDescription: (val: string) => void;
  tourInclusions: string;
  setTourInclusions: (val: string) => void;
  tourIsActive: boolean;
  setTourIsActive: (val: boolean) => void;
  activeTourTab: 'upload' | 'url';
  setActiveTourTab: (val: 'upload' | 'url') => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tourImageUrl: string;
  setTourImageUrl: (val: string) => void;
  selectedImageFile: File | null;
  setSelectedImageFile: (file: File | null) => void;
  uploadError: string | null;
  saveStatus: 'idle' | 'saving' | 'saved';
  handleSaveTour: (e: React.FormEvent) => void;
}

export const TourModal: React.FC<TourModalProps> = ({
  showTourModal,
  onClose,
  editingTour,
  tourName,
  setTourName,
  tourPrice,
  setTourPrice,
  tourPhone,
  setTourPhone,
  tourSocial,
  setTourSocial,
  tourDescription,
  setTourDescription,
  tourInclusions,
  setTourInclusions,
  tourIsActive,
  setTourIsActive,
  activeTourTab,
  setActiveTourTab,
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileSelectChange,
  tourImageUrl,
  setTourImageUrl,
  selectedImageFile,
  setSelectedImageFile,
  uploadError,
  saveStatus,
  handleSaveTour
}) => {
  return (
    <AnimatePresence>
      {showTourModal && (
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
                {editingTour ? "Ubah Paket Wisata" : "Tambah Paket Wisata"}
              </h3>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-4 font-sans text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Form Details */}
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-text-dark">Nama Paket Wisata</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kawah Ijen Blue Fire Tour"
                      value={tourName}
                      onChange={(e) => setTourName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-text-dark">Harga Paket Wisata (Bisa teks bebas)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rp 350.000 / orang, atau Hubungi Kami"
                      value={tourPrice}
                      onChange={(e) => setTourPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">WhatsApp Kontak</label>
                      <input
                        type="text"
                        required
                        placeholder="+628123456789"
                        value={tourPhone}
                        onChange={(e) => setTourPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Instagram Kontak</label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={tourSocial}
                        onChange={(e) => setTourSocial(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-text-dark">Deskripsi Singkat Paket</label>
                    <textarea
                      rows={3}
                      placeholder="Berikan gambaran aktivitas tur, rute, atau pengalaman yang akan didapatkan..."
                      value={tourDescription}
                      onChange={(e) => setTourDescription(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-text-dark">Fasilitas / Inklusi Tur (Pisahkan dengan koma)</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Tiket Masuk, Air Mineral, Masker Gas, Pemandu Lokal"
                      value={tourInclusions}
                      onChange={(e) => setTourInclusions(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-xs leading-relaxed"
                    />
                    <p className="text-[9px] text-gray-400">Setiap fasilitas dipisahkan tanda koma (,)</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 text-left">
                    <input
                      type="checkbox"
                      id="tourIsActive"
                      checked={tourIsActive}
                      onChange={(e) => setTourIsActive(e.target.checked)}
                      className="rounded text-green-soft focus:ring-green-soft w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="tourIsActive" className="text-xs font-semibold text-text-dark select-none cursor-pointer">
                      Aktifkan paket wisata ini agar langsung tayang di Landing Page
                    </label>
                  </div>
                </div>

                {/* Right Column: Image Manager */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-bold text-text-dark block">Foto Sampul Paket Wisata</label>
                    
                    {/* Sub-tabs untuk Tour Image: Upload vs URL */}
                    <div className="flex border-b border-gray-100 pb-1">
                      <button
                        type="button"
                        onClick={() => setActiveTourTab('upload')}
                        className={`px-3 py-1 text-xs border-b-2 font-semibold transition-all cursor-pointer ${
                          activeTourTab === 'upload' ? 'border-green-deep text-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        Unggah File
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTourTab('url')}
                        className={`px-3 py-1 text-xs border-b-2 font-semibold transition-all cursor-pointer ${
                          activeTourTab === 'url' ? 'border-green-deep text-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        Tautan URL Gambar
                      </button>
                    </div>

                    {activeTourTab === 'upload' ? (
                      <div className="space-y-3">
                        {/* File input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelectChange}
                          accept="image/*"
                          className="hidden"
                        />

                        {/* Image preview box */}
                        <div className="border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 flex flex-col items-center justify-center text-center space-y-3 min-h-[160px] relative overflow-hidden group">
                          {tourImageUrl ? (
                            <>
                              <img
                                src={tourImageUrl}
                                alt="Preview"
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="bg-white/90 text-text-dark text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                                >
                                  Ubah Gambar
                                </button>
                              </div>
                            </>
                          ) : (
                            <div 
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={`absolute inset-0 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors ${
                                dragActive ? 'bg-green-deep/5 border-green-soft/50' : 'hover:bg-gray-100/50'
                              }`}
                            >
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-[10px] text-gray-500 font-semibold">Tarik & lepas foto Anda ke sini</span>
                              <span className="text-[8px] text-gray-400 mt-0.5">Atau klik untuk menelusuri folder</span>
                            </div>
                          )}
                        </div>

                        {/* Cloud upload or selected file actions */}
                        <div className="space-y-2">
                          {selectedImageFile && (
                            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div className="min-w-0 flex-1 text-left">
                                <p className="text-[10px] font-bold text-emerald-800 truncate">Berkas siap: {selectedImageFile.name}</p>
                                <p className="text-[9px] text-emerald-600 leading-normal">
                                  Berkas terkompresi otomatis. Foto akan disimpan dan diunggah otomatis saat Anda mengklik "Save changes" di bawah.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedImageFile(null);
                                  setTourImageUrl("");
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="text-rose-500 hover:text-rose-700 font-bold flex-shrink-0 text-[10px] pl-2 border-l border-emerald-200 cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          )}
                          {uploadError && (
                            <div className="p-2 bg-rose-50 border border-rose-150 rounded-lg text-[9px] text-rose-700 leading-relaxed font-semibold text-left">
                              {uploadError}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-text-dark">URL Tautan Gambar (HTTP Link)</label>
                        <input
                          type="text"
                          placeholder="https://example.com/images/tour.jpg"
                          value={tourImageUrl}
                          onChange={(e) => setTourImageUrl(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                        />
                        <p className="text-[9px] text-gray-400 leading-relaxed mt-1">
                          Gunakan URL jika gambar sudah dihosting di tempat lain seperti Supabase Storage, Imgur, Cloudinary, atau platform lainnya.
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
                      <span>Saving...</span>
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save changes</span>
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
