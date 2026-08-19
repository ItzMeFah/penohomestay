import React from 'react';
import { Plus, MapPin, Edit2, Trash2 } from 'lucide-react';
import { CMSHomepage, CMSTourPackage } from '../../types';

interface AdminToursProps {
  homepageData: CMSHomepage;
  handleOpenAddTour: () => void;
  handleOpenEditTour: (tour: CMSTourPackage) => void;
  handleDeleteTour: (id: number) => void;
}

export const AdminTours: React.FC<AdminToursProps> = ({
  homepageData,
  handleOpenAddTour,
  handleOpenEditTour,
  handleDeleteTour
}) => {
  return (
    <div id="admin-tours-view" className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
        <div>
          <h3 className="font-serif text-xl font-bold text-green-deep">Manajemen Paket Wisata</h3>
          <p className="text-xs text-gray-500">Atur paket pengalaman alam dan kuliner Banyuwangi yang ditawarkan kepada tamu.</p>
        </div>
        <button
          id="tours-add-btn"
          type="button"
          onClick={handleOpenAddTour}
          className="inline-flex items-center space-x-1.5 bg-green-deep hover:bg-green-mid text-cream font-semibold px-5 py-2.5 rounded-xl text-xs shadow hover:shadow-md cursor-pointer transition-all self-start sm:self-center active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Paket Wisata</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(homepageData.tours || []).map((tour) => (
          <div 
            key={tour.id} 
            className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
          >
            {/* Image preview */}
            <div className="aspect-[16/10] w-full bg-gray-50 relative flex-shrink-0 overflow-hidden">
              {tour.imageUrl ? (
                <img 
                  src={tour.imageUrl} 
                  alt={tour.name} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-deep/5 text-green-soft">
                  <MapPin className="w-10 h-10 opacity-30" />
                </div>
              )}
              <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                tour.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {tour.isActive ? 'Aktif' : 'Nonaktif'}
              </div>
            </div>

            {/* Tour info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-green-deep text-base line-clamp-1 group-hover:text-green-soft transition-colors">{tour.name}</h4>
                {tour.price && (
                  <p className="text-xs font-bold text-green-soft">{tour.price}</p>
                )}
                <p className="text-xs text-text-mid font-light leading-relaxed line-clamp-3">{tour.description}</p>
                
                {tour.inclusions && tour.inclusions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {tour.inclusions.map((inc, i) => (
                      <span key={i} className="bg-sand/20 text-text-dark text-[10px] px-2 py-0.5 rounded-md font-medium border border-sand/30">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleOpenEditTour(tour)}
                  className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTour(tour.id)}
                  className="flex-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!homepageData.tours || homepageData.tours.length === 0) && (
          <div className="col-span-full py-16 text-center text-gray-400 text-xs font-sans">
            Belum ada paket wisata. Klik "Tambah Paket Wisata" untuk membuatnya.
          </div>
        )}
      </div>
    </div>
  );
};
