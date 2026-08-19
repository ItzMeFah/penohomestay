import { useState, useEffect } from 'react';
import { CMSHomepage } from '../types';

interface UseAdminCMSProps {
  homepageData: CMSHomepage;
  settings: any;
  onUpdateHomepage: (data: CMSHomepage) => void;
  onUpdateSettings: (s: any) => void;
  showAdminToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
}

export const useAdminCMS = ({
  homepageData,
  settings,
  onUpdateHomepage,
  onUpdateSettings,
  showAdminToast
}: UseAdminCMSProps) => {
  const [activeCmsTab, setActiveCmsTab] = useState<'hero' | 'stats' | 'about' | 'features' | 'testimonials' | 'info'>('hero');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // CMS Local States for edits
  const [cmsHero, setCmsHero] = useState(homepageData.hero);
  const [cmsStats, setCmsStats] = useState(homepageData.stats);
  const [cmsAbout, setCmsAbout] = useState(homepageData.about);
  const [cmsFeatures, setCmsFeatures] = useState(homepageData.features);
  const [cmsTestimonials, setCmsTestimonials] = useState(homepageData.testimonials);
  const [cmsInfo, setCmsInfo] = useState(homepageData.info);

  // Sync CMS local state with loaded database data on prop changes
  useEffect(() => {
    setCmsHero(homepageData.hero);
    setCmsStats(homepageData.stats);
    setCmsAbout(homepageData.about);
    setCmsFeatures(homepageData.features);
    setCmsTestimonials(homepageData.testimonials);
    setCmsInfo(homepageData.info);
  }, [homepageData]);

  const handleSaveCmsHero = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, hero: cmsHero });
    showAdminToast("Konten Hero berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsStats = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, stats: cmsStats });
    showAdminToast("Konten Statistik berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsAbout = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, about: cmsAbout });
    showAdminToast("Konten Tentang Kami berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsFeatures = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, features: cmsFeatures });
    showAdminToast("Konten Keunggulan berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsTestimonials = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, testimonials: cmsTestimonials });
    showAdminToast("Ulasan Tamu berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsInfo = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, info: cmsInfo });
    onUpdateSettings({
      ...settings,
      pricePerNight: cmsInfo.price_from,
      checkIn: cmsInfo.checkin,
      checkOut: cmsInfo.checkout
    });
    showAdminToast("Informasi Menginap berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  return {
    activeCmsTab,
    setActiveCmsTab,
    saveStatus,
    setSaveStatus,
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
    handleSaveCmsInfo
  };
};
