import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Upload, Check, RefreshCw, Save } from 'lucide-react';

interface HighlightModalProps {
  showHighlightModal: boolean;
  onClose: () => void;
  editingHighlight: any;
  highlightTitle: string;
  setHighlightTitle: (val: string) => void;
  highlightDescription: string;
  setHighlightDescription: (val: string) => void;
  activeHighlightTab: 'upload' | 'url';
  setActiveHighlightTab: (val: 'upload' | 'url') => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  highlightImageUrl: string;
  setHighlightImageUrl: (val: string) => void;
  selectedImageFile: File | null;
  setSelectedImageFile: (file: File | null) => void;
  uploadError: string | null;
  saveStatus: 'idle' | 'saving' | 'saved';
  handleSaveHighlight: (e: React.FormEvent) => void;
}

export const HighlightModal: React.FC<HighlightModalProps> = ({
  showHighlightModal,
  onClose,
  editingHighlight,
  highlightTitle,
  setHighlightTitle,
  highlightDescription,
  setHighlightDescription,
  activeHighlightTab,
  setActiveHighlightTab,
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileSelectChange,
  highlightImageUrl,
  setHighlightImageUrl,
  selectedImageFile,
  setSelectedImageFile,
  uploadError,
  saveStatus,
  handleSaveHighlight
}) => {
  return (
    <AnimatePresence>
      {showHighlightModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-150 pb-3">
              <h3 className="font-serif text-xl font-bold text-green-deep flex items-center space-x-2">
                <span className="p-1.5 bg-green-deep/10 rounded-lg text-green-deep">
                  <Star className="w-5 h-5 fill-green-deep" />
                </span>
                <span>{editingHighlight ? 'Ubah Highlight' : 'Tambah Highlight Baru'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Buat atau ubah kartu nilai tambah yang tampil di landing page.</p>
            </div>

            <form onSubmit={handleSaveHighlight} className="space-y-4 font-sans text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Judul Highlight <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lush Coffee Plantation"
                  value={highlightTitle}
                  onChange={(e) => setHighlightTitle(e.target.value)}
                  className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Tur keliling kebun kopi, belajar cara panen, sangrai tradisional..."
                  value={highlightDescription}
                  onChange={(e) => setHighlightDescription(e.target.value)}
                  className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft p-3 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                />
              </div>

              {/* IMAGE TAB SELECTOR */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Foto Highlight</label>
                <div className="flex border border-gray-150 rounded-xl p-1 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setActiveHighlightTab('upload')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeHighlightTab === 'upload' ? 'bg-white shadow-sm text-green-deep' : 'text-gray-400 hover:text-green-soft'
                    }`}
                  >
                    Unggah File Gambar
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHighlightTab('url')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeHighlightTab === 'url' ? 'bg-white shadow-sm text-green-deep' : 'text-gray-400 hover:text-green-soft'
                    }`}
                  >
                    Alamat URL Gambar
                  </button>
                </div>

                {activeHighlightTab === 'upload' ? (
                  <div className="space-y-3">
                    {/* Drag and Drop Zone */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-green-soft bg-green-deep/5 scale-[0.99]' 
                          : 'border-sand/40 hover:border-sand bg-cream/5 hover:bg-cream/10'
                      }`}
                    >
                      <Upload className="w-8 h-8 mx-auto text-green-soft/60 mb-2" />
                      <p className="text-xs font-bold text-green-deep">Klik untuk memilih atau seret gambar ke sini</p>
                      <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG (Maks. 2MB). Kompresi otomatis aktif.</p>
                      <input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelectChange}
                      />
                    </div>

                    {/* Preview Image */}
                    {highlightImageUrl && (
                      <div className="flex items-center space-x-3 bg-gray-50 border border-gray-150 p-2.5 rounded-xl">
                        <img 
                          src={highlightImageUrl} 
                          alt="Preview" 
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[10px] font-bold text-green-deep truncate">Pratinjau Gambar</p>
                          <p className="text-[9px] text-gray-400 truncate">Selesai dimuat lokal atau diunggah.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHighlightImageUrl("")}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* File selected indicator */}
                    {selectedImageFile && (
                      <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-left">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-emerald-800 truncate">Berkas siap: {selectedImageFile.name}</p>
                          <p className="text-[9px] text-emerald-600">Akan diunggah otomatis saat Anda mengklik tombol "Save changes" di bawah.</p>
                        </div>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-[10px] font-bold text-rose-500 text-left">{uploadError}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="url"
                      placeholder="Masukkan alamat URL foto (https://...)"
                      value={highlightImageUrl}
                      onChange={(e) => setHighlightImageUrl(e.target.value)}
                      className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                    />
                    {highlightImageUrl && (
                      <div className="mt-2 aspect-[16/10] bg-gray-50 border border-gray-150 rounded-xl overflow-hidden">
                        <img 
                          src={highlightImageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&h=400&q=80';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors text-center cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveStatus !== 'idle'}
                  className="flex-1 py-3 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold rounded-xl text-xs shadow transition-all hover:-translate-y-0.5 active:scale-95 text-center flex items-center justify-center space-x-2 cursor-pointer"
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
