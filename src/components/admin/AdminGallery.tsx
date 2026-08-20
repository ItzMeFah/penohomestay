import React from 'react';
import { Plus, RefreshCw, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { GalleryItem } from '../../types';

interface AdminGalleryProps {
  activeTab: 'gallery' | 'header';
  galleryData: GalleryItem[];
  handleResetGallery: () => void;
  handleOpenAddGallery: () => void;
  handleOpenEditGallery: (item: GalleryItem) => void;
  handleDeleteGalleryItem: (id: number | string) => void;
  handleMoveGalleryItem: (id: number | string, direction: 'up' | 'down', isHeaderOnly: boolean) => void;
}

export const AdminGallery: React.FC<AdminGalleryProps> = ({
  activeTab,
  galleryData,
  handleResetGallery,
  handleOpenAddGallery,
  handleOpenEditGallery,
  handleDeleteGalleryItem,
  handleMoveGalleryItem
}) => {
  const isHeader = activeTab === 'header';
  const filteredData = [...galleryData]
    .filter(item => isHeader ? item.showInSlideshow !== false : item.showInGallery !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div id={`admin-${activeTab}-view`} className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-green-deep">
            {isHeader ? 'Manajemen Slideshow Header' : 'Manajemen Galeri Homestay'}
          </h3>
          <p className="font-sans text-xs text-gray-500">
            {isHeader 
              ? 'Kelola foto latar belakang berputar (slideshow) di bagian atas Landing Page. Disarankan rasio lanskap 16:9.' 
              : 'Kelola visual, kategori, atau ubah urutan tampilan galeri dengan menekan tombol panah naik-turun.'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetGallery}
            className="border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-sm cursor-pointer"
            title={isHeader ? 'Reset seluruh foto ke bawaan jika memori penyimpanan penuh.' : 'Reset seluruh foto galeri ke bawaan jika memori penyimpanan penuh.'}
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isHeader ? 'Reset Slideshow' : 'Reset Galeri'}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddGallery}
            className="bg-green-soft hover:bg-green-deep text-cream font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isHeader ? 'Tambah Slide' : 'Tambah Foto'}</span>
          </button>
        </div>
      </div>

      {/* Gallery Items Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item, idx, arr) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4">
            <div className={`${isHeader ? 'aspect-[16/9]' : 'aspect-[4/3]'} w-full rounded-xl overflow-hidden bg-gray-50 border flex items-center justify-center relative`}>
              {item.url ? (
                <img src={item.url} alt={item.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono text-xs font-semibold" style={{ color: item.color }}>Placeholder Illustration</span>
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                {isHeader ? `Slide #${idx + 1} (Urutan: ${item.order})` : `Urutan: ${item.order}`}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif font-bold text-sm text-green-deep">{item.label}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">{item.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.showInSlideshow !== false && (
                      <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200">Header Slide</span>
                    )}
                    {item.showInGallery !== false && (
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">Menu Galeri</span>
                    )}
                    {item.showInSlideshow === false && item.showInGallery === false && (
                      <span className="bg-gray-100 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200">Sembunyi</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Control arrows for manual reordering */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex space-x-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveGalleryItem(item.id, 'up', isHeader)}
                    className="p-1 bg-gray-100 hover:bg-green-soft/15 hover:text-green-deep text-gray-500 rounded disabled:opacity-30 cursor-pointer"
                    title="Geser Naik"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-90" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === arr.length - 1}
                    onClick={() => handleMoveGalleryItem(item.id, 'down', isHeader)}
                    className="p-1 bg-gray-100 hover:bg-green-soft/15 hover:text-green-deep text-gray-500 rounded disabled:opacity-30 cursor-pointer"
                    title="Geser Turun"
                  >
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>

                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditGallery(item)}
                    className="p-1.5 bg-gray-50 hover:bg-green-soft/10 text-green-soft rounded-lg cursor-pointer"
                    title="Ubah"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryItem(item.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
