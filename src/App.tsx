import { AnimatePresence } from 'motion/react';
import { useAppState } from './hooks/useAppState';
import { LandingPage } from './pages/LandingPage';
import { BookingEngine } from './pages/BookingEngine';
import { AdminPanel } from './pages/AdminPanel';
import { SupabasePlaybook } from './pages/SupabasePlaybook';
import { RouteLoader } from './components/RouteLoader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function App() {
  const {
    route,
    homepageData,
    galleryData,
    bookings,
    blockedDates,
    notifications,
    settings,
    isScrolled,
    isRouteLoading,
    activeSection,
    selectedVillaId,
    setSelectedVillaId,
    lang,
    setLang,
    showLangTooltip,
    currency,
    setCurrency,
    handleUpdateHomepage,
    handleUpdateGallery,
    handleUpdateBlockedDates,
    handleUpdateSettings,
    handleUpdateBookings,
    handleUpdateNotifications,
    handleSubmitBooking,
    navigateToPage
  } = useAppState();

  const isAdminView = route.startsWith('/backoffice') || route.startsWith('/admin');

  return (
    <div className="font-sans min-h-screen text-text-dark bg-cream/40 overflow-x-hidden w-full max-w-full">
      <AnimatePresence>
        {isRouteLoading && <RouteLoader />}
      </AnimatePresence>
      
      {/* 1. PUBLIC HEADER NAVBAR */}
      {!isAdminView && (
        <Navbar
          settings={settings}
          lang={lang}
          setLang={setLang}
          activeSection={activeSection}
          showLangTooltip={showLangTooltip}
          isScrolled={isScrolled}
          onNavigate={navigateToPage}
        />
      )}

      {/* 2. CORE Switch Route Views */}
      <div className="min-h-screen overflow-x-hidden w-full max-w-full">
        {route === '/home' && (
          <LandingPage
            homepageData={homepageData}
            galleryData={galleryData}
            settings={settings}
            bookings={bookings}
            onNavigate={navigateToPage}
            currency={currency}
            lang={lang}
            setSelectedVillaId={setSelectedVillaId}
          />
        )}

        {route === '/home/book' && (
          <BookingEngine
            settings={settings}
            bookings={bookings}
            blockedDates={blockedDates}
            onSubmitBooking={handleSubmitBooking}
            onNavigate={navigateToPage}
            currency={currency}
            onChangeCurrency={setCurrency}
            lang={lang}
            homepageData={homepageData}
            selectedVillaId={selectedVillaId}
            setSelectedVillaId={setSelectedVillaId}
          />
        )}

        {(import.meta as any).env?.DEV && route === '/supabase' && (
          <div className="pt-28 pb-16 px-4 md:px-12 max-w-7xl mx-auto">
            <SupabasePlaybook />
          </div>
        )}

        {(route.startsWith('/backoffice') || route.startsWith('/admin')) && (
          <AdminPanel
            bookings={bookings}
            blockedDates={blockedDates}
            homepageData={homepageData}
            galleryData={galleryData}
            settings={settings}
            notifications={notifications}
            onUpdateBookings={handleUpdateBookings}
            onUpdateBlockedDates={handleUpdateBlockedDates}
            onUpdateHomepage={handleUpdateHomepage}
            onUpdateGallery={handleUpdateGallery}
            onUpdateSettings={handleUpdateSettings}
            onUpdateNotifications={handleUpdateNotifications}
          />
        )}
      </div>

      {/* 4. PUBLIC FOOTER */}
      {!isAdminView && (
        <Footer
          settings={settings}
          lang={lang}
          onNavigate={navigateToPage}
        />
      )}
    </div>
  );
}
