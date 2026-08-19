import React from 'react';
import { Plus, Home, Edit2, Trash2 } from 'lucide-react';
import { CMSHomepage } from '../../types';
import { convertAndFormatPrice } from '../../utils/storage';

interface AdminVillasProps {
  homepageData: CMSHomepage;
  handleOpenAddVilla: () => void;
  handleOpenEditVilla: (villa: any) => void;
  handleDeleteVilla: (id: string) => void;
}

export const AdminVillas: React.FC<AdminVillasProps> = ({
  homepageData,
  handleOpenAddVilla,
  handleOpenEditVilla,
  handleDeleteVilla
}) => {
  return (
    <div id="admin-villas-view" className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-sand/15 pb-4 gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-green-deep">Daftar Villa & Kamar</h3>
          <p className="font-sans text-xs text-text-mid font-light mt-1">Kelola data kamar/villas, kapasitas, sarapan, harga, dan gambar yang akan muncul sebagai pilihan di panel pemesanan pengunjung.</p>
        </div>
        <button
          id="villas-add-btn"
          onClick={handleOpenAddVilla}
          className="flex items-center space-x-2 bg-green-deep hover:bg-green-soft text-cream text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all self-start cursor-pointer hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Villa / Kamar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(homepageData.villas || []).map((villa: any) => (
          <div
            key={villa.id}
            className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col bg-cream/5"
          >
            {/* Villa Image */}
            <div className="h-48 relative bg-gray-100 flex-shrink-0">
              {villa.imageUrl ? (
                <img
                  src={villa.imageUrl}
                  alt={villa.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-sand/15 text-green-soft/70">
                  <Home className="w-10 h-10 stroke-1" />
                  <span className="text-[10px] font-sans mt-2">Belum ada foto</span>
                </div>
              )}
              
              {/* Price Badge */}
              <div className="absolute top-3 right-3 bg-green-deep text-cream text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">
                {convertAndFormatPrice(villa.pricePerPax, 'IDR')} / malam
              </div>

              {/* Capacity / Breakfast Badge */}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <span className="bg-white/90 backdrop-blur-xs text-text-dark text-[10px] font-bold px-2 py-1 rounded-lg shadow-xs flex items-center gap-1">
                  👤 {villa.capacity} Pax
                </span>
                {villa.includeBreakfast ? (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-xs">
                    🍳 Incl. Breakfast
                  </span>
                ) : (
                  <span className="bg-gray-400 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-xs">
                    ❌ No Breakfast
                  </span>
                )}
              </div>
            </div>

            {/* Villa Info */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="font-serif text-base font-bold text-green-deep leading-snug">{villa.title}</h4>
                <p className="font-sans text-xs text-text-mid font-light leading-relaxed line-clamp-3">
                  {villa.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-sand/10">
                <button
                  type="button"
                  onClick={() => handleOpenEditVilla(villa)}
                  className="flex items-center space-x-1 px-3 py-2 bg-cream hover:bg-sand/30 text-green-deep text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteVilla(villa.id)}
                  className="flex items-center space-x-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {(homepageData.villas || []).length === 0 && (
          <div className="md:col-span-2 text-center p-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Home className="w-12 h-12 mx-auto text-gray-300 stroke-1" />
            <p className="font-sans text-sm text-gray-400 mt-3 font-light">Belum ada data Villa/Kamar yang terdaftar.</p>
            <button
              id="villas-add-first-btn"
              onClick={handleOpenAddVilla}
              className="mt-4 inline-flex items-center space-x-1.5 bg-green-deep text-cream px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Villa/Kamar Pertama</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
