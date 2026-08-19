import React from 'react';
import { Save, Check, RefreshCw, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { CMSHomepage, CMSHighlightItem } from '../../types';

interface AdminCMSProps {
  activeCmsTab: 'hero' | 'stats' | 'about' | 'features' | 'testimonials' | 'info';
  setActiveCmsTab: (val: any) => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  cmsHero: any;
  setCmsHero: (val: any) => void;
  cmsStats: any[];
  setCmsStats: (val: any[]) => void;
  cmsAbout: any;
  setCmsAbout: (val: any) => void;
  cmsFeatures: any[];
  setCmsFeatures: (val: any[]) => void;
  cmsTestimonials: any[];
  setCmsTestimonials: (val: any[]) => void;
  cmsInfo: any;
  setCmsInfo: (val: any) => void;
  handleSaveCmsHero: () => void;
  handleSaveCmsStats: () => void;
  handleSaveCmsAbout: () => void;
  handleSaveCmsFeatures: () => void;
  handleSaveCmsTestimonials: () => void;
  handleSaveCmsInfo: () => void;
  homepageData: CMSHomepage;
  handleOpenAddHighlight: () => void;
  handleOpenEditHighlight: (item: CMSHighlightItem) => void;
  handleDeleteHighlight: (id: string) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  activeCmsTab,
  setActiveCmsTab,
  saveStatus,
  cmsHero,
  setCmsHero,
  cmsStats,
  setCmsStats,
  cmsAbout,
  setCmsAbout,
  cmsFeatures,
  setCmsFeatures,
  cmsTestimonials,
  setCmsTestimonials,
  cmsInfo,
  setCmsInfo,
  handleSaveCmsHero,
  handleSaveCmsStats,
  handleSaveCmsAbout,
  handleSaveCmsFeatures,
  handleSaveCmsTestimonials,
  handleSaveCmsInfo,
  homepageData,
  handleOpenAddHighlight,
  handleOpenEditHighlight,
  handleDeleteHighlight
}) => {
  const saveBtnLabel = (action: () => void) => {
    return (
      <button
        type="button"
        onClick={action}
        disabled={saveStatus !== 'idle'}
        className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-6 py-2.5 rounded-xl text-sm shadow cursor-pointer transition-all active:scale-95"
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
    );
  };

  return (
    <div id="admin-cms-view" className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      {/* Left Sub-tabs Sidebar */}
      <div className="w-full md:w-48 border-r border-gray-100 p-4 bg-gray-50/50 flex-shrink-0 flex flex-col space-y-1">
        {['hero', 'stats', 'about', 'features', 'testimonials', 'info'].map((tab) => (
          <button
            key={tab}
            id={`cms-tab-${tab}`}
            onClick={() => setActiveCmsTab(tab as any)}
            className={`px-4 py-2 text-left rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeCmsTab === tab ? 'bg-green-soft text-cream' : 'text-gray-500 hover:bg-gray-100 hover:text-green-deep'
            }`}
          >
            {tab === 'hero' ? 'Banner Hero' :
             tab === 'stats' ? 'Statistik Bar' :
             tab === 'about' ? 'Tentang Kami' :
             tab === 'features' ? 'Keunggulan' :
             tab === 'testimonials' ? 'Ulasan Tamu' : 'Detail Menginap'}
          </button>
        ))}
      </div>

      {/* Right Panel fields Form */}
      <div className="flex-grow p-8 space-y-6">
        
        {activeCmsTab === 'hero' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit Banner Hero</h4>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dark">Headline (HTML / em supported)</label>
              <textarea
                rows={3}
                value={cmsHero.headline}
                onChange={(e) => setCmsHero({ ...cmsHero, headline: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dark">Subheadline</label>
              <textarea
                rows={2}
                value={cmsHero.subheadline}
                onChange={(e) => setCmsHero({ ...cmsHero, subheadline: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-dark">Badge Rating Google</label>
              <input
                type="text"
                value={cmsHero.badge}
                onChange={(e) => setCmsHero({ ...cmsHero, badge: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            {saveBtnLabel(handleSaveCmsHero)}
          </div>
        )}

        {activeCmsTab === 'stats' && (
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit Statistik Bar</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cmsStats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kolom {idx + 1}</span>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Angka / Nilai</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const copy = [...cmsStats];
                        copy[idx].value = e.target.value;
                        setCmsStats(copy);
                      }}
                      className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Label Keterangan</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const copy = [...cmsStats];
                        copy[idx].label = e.target.value;
                        setCmsStats(copy);
                      }}
                      className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            {saveBtnLabel(handleSaveCmsStats)}
          </div>
        )}

        {activeCmsTab === 'about' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-serif text-lg font-bold text-green-deep">Edit Tentang Kami</h4>
              <p className="text-xs text-gray-400">Atur deskripsi selamat datang homestay di halaman utama.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark">Judul Utama</label>
                <input
                  type="text"
                  value={cmsAbout.title}
                  onChange={(e) => setCmsAbout({ ...cmsAbout, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark">Teks Deskripsi</label>
                <textarea
                  rows={4}
                  value={cmsAbout.body}
                  onChange={(e) => setCmsAbout({ ...cmsAbout, body: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm"
                />
              </div>
              {saveBtnLabel(handleSaveCmsAbout)}
            </div>

            {/* Highlights Section */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="font-serif text-base font-bold text-green-deep">Manajemen Grid Highlights (4 Cards)</h5>
                  <p className="text-xs text-gray-400">Atur kartu-kartu nilai tambah yang tampil di landing page.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddHighlight}
                  className="inline-flex items-center space-x-1.5 bg-green-soft hover:bg-green-mid text-cream font-semibold px-4 py-2 rounded-xl text-xs shadow cursor-pointer transition-all self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Highlight</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(homepageData.about.highlightItems || []).map((hl) => (
                  <div 
                    key={hl.id} 
                    className="bg-white border border-gray-100 rounded-xl p-4 flex space-x-4 items-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 relative">
                      {hl.imageUrl ? (
                        <img src={hl.imageUrl} alt={hl.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-deep/5 text-green-soft">
                          <ImageIcon className="w-6 h-6 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-16">
                      <h6 className="font-sans font-bold text-green-deep text-xs truncate">{hl.title}</h6>
                      <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">{hl.description || "Tidak ada deskripsi."}</p>
                    </div>
                    <div className="absolute right-3 flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditHighlight(hl)}
                        className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 rounded-lg transition-colors cursor-pointer"
                        title="Ubah"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHighlight(hl.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!homepageData.about.highlightItems || homepageData.about.highlightItems.length === 0) && (
                  <div className="col-span-full py-8 text-center text-gray-400 text-xs bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    Belum ada highlights. Klik "Tambah Highlight" untuk membuatnya.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeCmsTab === 'features' && (
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit 6 Keunggulan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {cmsFeatures.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keunggulan Ke-{idx + 1}</span>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Judul</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const copy = [...cmsFeatures];
                        copy[idx].title = e.target.value;
                        setCmsFeatures(copy);
                      }}
                      className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-1.5 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Deskripsi Ringkas</label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => {
                        const copy = [...cmsFeatures];
                        copy[idx].desc = e.target.value;
                        setCmsFeatures(copy);
                      }}
                      className="w-full bg-white border border-gray-200 focus:border-green-soft p-2 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
            {saveBtnLabel(handleSaveCmsFeatures)}
          </div>
        )}

        {activeCmsTab === 'testimonials' && (
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit Ulasan Tamu</h4>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {cmsTestimonials.map((test, idx) => (
                <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ulasan Ke-{idx + 1}</span>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Nama Reviewer</label>
                    <input
                      type="text"
                      value={test.author}
                      onChange={(e) => {
                        const copy = [...cmsTestimonials];
                        copy[idx].author = e.target.value;
                        setCmsTestimonials(copy);
                      }}
                      className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-1.5 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Teks Ulasan</label>
                    <textarea
                      rows={3}
                      value={test.text}
                      onChange={(e) => {
                        const copy = [...cmsTestimonials];
                        copy[idx].text = e.target.value;
                        setCmsTestimonials(copy);
                      }}
                      className="w-full bg-white border border-gray-200 focus:border-green-soft p-2.5 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
            {saveBtnLabel(handleSaveCmsTestimonials)}
          </div>
        )}

        {activeCmsTab === 'info' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Detail & Kebijakan Menginap</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-dark">Waktu Check-In</label>
                <input
                  type="text"
                  value={cmsInfo.checkin}
                  onChange={(e) => setCmsInfo({ ...cmsInfo, checkin: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-dark">Waktu Check-Out</label>
                <input
                  type="text"
                  value={cmsInfo.checkout}
                  onChange={(e) => setCmsInfo({ ...cmsInfo, checkout: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-dark">Harga Dasar Per Malam (K IDR)</label>
                <input
                  type="number"
                  value={cmsInfo.price_from}
                  onChange={(e) => setCmsInfo({ ...cmsInfo, price_from: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark">Fasilitas (1 per baris)</label>
                <textarea
                  rows={5}
                  value={cmsInfo.facilities.join("\n")}
                  onChange={(e) => setCmsInfo({ ...cmsInfo, facilities: e.target.value.split("\n") })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dark">Aktivitas (1 per baris)</label>
                <textarea
                  rows={5}
                  value={cmsInfo.activities.join("\n")}
                  onChange={(e) => setCmsInfo({ ...cmsInfo, activities: e.target.value.split("\n") })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm font-sans"
                />
              </div>
            </div>

            {saveBtnLabel(handleSaveCmsInfo)}
          </div>
        )}

      </div>
    </div>
  );
};
