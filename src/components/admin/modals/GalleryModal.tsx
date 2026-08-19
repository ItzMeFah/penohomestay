import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Check, RefreshCw, Save } from 'lucide-react';

interface GalleryModalProps {
  showAddGalleryModal: boolean;
  onClose: () => void;
  editingGalleryItem: any;
  galleryLabel: string;
  setGalleryLabel: (val: string) => void;
  galleryCategory: string;
  setGalleryCategory: (val: string) => void;
  galleryColor: string;
  setGalleryColor: (val: string) => void;
  galleryOrder: number;
  setGalleryOrder: (val: number) => void;
  activeGalleryTab: 'upload' | 'url';
  setActiveGalleryTab: (val: 'upload' | 'url') => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  galleryUrl: string;
  setGalleryUrl: (val: string) => void;
  selectedImageFile: File | null;
  setSelectedImageFile: (file: File | null) => void;
  uploadError: string | null;
  saveStatus: 'idle' | 'saving' | 'saved';
  handleSaveGalleryItem: (e: React.FormEvent) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  showAddGalleryModal,
  onClose,
  editingGalleryItem,
  galleryLabel,
  setGalleryLabel,
  galleryCategory,
  setGalleryCategory,
  galleryColor,
  setGalleryColor,
  galleryOrder,
  setGalleryOrder,
  activeGalleryTab,
  setActiveGalleryTab,
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileSelectChange,
  galleryUrl,
  setGalleryUrl,
  selectedImageFile,
  setSelectedImageFile,
  uploadError,
  saveStatus,
  handleSaveGalleryItem
}) => {
  return (
    <AnimatePresence>
      {showAddGalleryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 md:p-7 max-w-2xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-2">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-green-deep text-left">
                {editingGalleryItem ? "Ubah Foto Galeri" : "Tambah Foto Baru"}
              </h3>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-3 font-sans text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left Column: Metadata Details */}
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Caption / Label Foto</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kamar Utama"
                        value={galleryLabel}
                        onChange={(e) => setGalleryLabel(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-2.5 py-1.5 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Kategori</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-2 py-1.5 rounded-xl text-xs cursor-pointer"
                      >
                        <option value="Alam">Alam & Sungai</option>
                        <option value="Kamar">Kamar & Akomodasi</option>
                        <option value="Kuliner">Kuliner & Sarapan</option>
                        <option value="Aktivitas">Aktivitas & Tur</option>
                        <option value="Sekitar">Sekitar Banyuwangi</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark block truncate">Warna Placeholder</label>
                      <div className="flex space-x-1.5 items-center">
                        <input
                          type="color"
                          value={galleryColor}
                          onChange={(e) => setGalleryColor(e.target.value)}
                          className="w-7 h-7 border border-gray-200 rounded-lg cursor-pointer p-0.5 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          required
                          value={galleryColor}
                          onChange={(e) => setGalleryColor(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 px-1.5 py-1 rounded-lg text-[10px] font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">No. Urutan</label>
                      <input
                        type="number"
                        required
                        value={galleryOrder}
                        onChange={(e) => setGalleryOrder(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-2 py-1 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Media Upload / URL Source */}
                <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-gray-150 pt-2.5 md:pt-0 md:pl-4">
                  <div className="flex border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('upload')}
                      className={`flex-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                        activeGalleryTab === 'upload' ? 'border-green-deep text-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Unggah File Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('url')}
                      className={`flex-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                        activeGalleryTab === 'url' ? 'border-green-deep text-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Tautan URL Gambar
                    </button>
                  </div>

                  {activeGalleryTab === 'upload' ? (
                    <div className="space-y-2">
                      {/* Drag and Drop Zone */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 ${
                          dragActive 
                            ? 'border-green-deep bg-green-50/10 scale-[0.99]' 
                            : 'border-gray-200 hover:border-green-soft bg-gray-50/50 hover:bg-white'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelectChange}
                          className="hidden"
                        />
                        
                        {galleryUrl ? (
                          <div className="relative group w-full aspect-video max-h-24 rounded-lg overflow-hidden border">
                            <img src={galleryUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <span className="text-white text-[9px] font-semibold bg-green-deep px-2 py-0.5 rounded-md shadow">Ganti Foto</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3 text-left w-full py-0.5">
                            <div className="p-1.5 bg-green-soft/10 text-green-deep rounded-full shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-text-dark">Pilih foto atau seret ke sini</p>
                              <p className="text-[8px] text-gray-400">JPG, PNG, WEBP (Maks 5MB)</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info / Actions if file selected */}
                      {selectedImageFile && (
                        <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 flex items-center space-x-2 text-left">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-emerald-800 truncate">Berkas siap: {selectedImageFile.name}</p>
                            <p className="text-[9px] text-emerald-600 leading-normal">
                              Berkas terkompresi otomatis. Foto akan disimpan dan diunggah otomatis saat Anda mengklik "Save changes" di bawah.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImageFile(null);
                              setGalleryUrl("");
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="text-rose-500 hover:text-rose-700 font-bold flex-shrink-0 text-[10px] pl-2 border-l border-emerald-200 cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-text-dark">URL Tautan Gambar (HTTP Link)</label>
                      <input
                        type="text"
                        placeholder="https://example.com/images/room.jpg"
                        value={galleryUrl}
                        onChange={(e) => setGalleryUrl(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                      />
                      <p className="text-[9px] text-gray-400 leading-relaxed mt-1">
                        Gunakan URL jika gambar sudah dihosting di tempat lain seperti Supabase Storage, Imgur, Cloudinary, atau platform lainnya.
                      </p>
                    </div>
                  )}
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
