import React, { useEffect, createElement } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CoachingPage } from './pages/CoachingPage';
import { AppComingSoonPage } from './pages/AppComingSoonPage';
import { TravelPage } from './pages/TravelPage';
import { FreeResourcesPage } from './pages/FreeResourcesPage';
import { WorkoutPlansPage } from './pages/WorkoutPlansPage';
import { ChecklistsPage } from './pages/ChecklistsPage';
import { CleaningListsPage } from './pages/checklists/CleaningListsPage';
import { TravelListsPage } from './pages/checklists/TravelListsPage';
import { OrganizationListsPage } from './pages/checklists/OrganizationListsPage';
import { SelfCareListsPage } from './pages/checklists/SelfCareListsPage';
import { LifeHacksListsPage } from './pages/checklists/LifeHacksListsPage';
import { SundayResetPage } from './pages/checklists/interactive/SundayResetPage';
import { CleaningTasksForgottenPage } from './pages/checklists/interactive/CleaningTasksForgottenPage';
import { HotMessCleanPage } from './pages/checklists/interactive/HotMessCleanPage';
import { UltimateCleaningSchedulePage } from './pages/checklists/interactive/UltimateCleaningSchedulePage';
import { DailyCleaningPage } from './pages/checklists/interactive/free/DailyCleaningPage';
import { WeeklyCleaningPage } from './pages/checklists/interactive/free/WeeklyCleaningPage';
import { MonthlyCleaningPage } from './pages/checklists/interactive/free/MonthlyCleaningPage';
import { QuarterlyCleaningPage } from './pages/checklists/interactive/free/QuarterlyCleaningPage';
import { BiannualCleaningPage } from './pages/checklists/interactive/free/BiannualCleaningPage';
import { YearlyCleaningPage } from './pages/checklists/interactive/free/YearlyCleaningPage';
import { DailySelfCarePage } from './pages/checklists/interactive/free/DailySelfCarePage';
import { KitchenCleaningPage } from './pages/checklists/interactive/KitchenCleaningPage';
import { LivingRoomCleaningPage } from './pages/checklists/interactive/LivingRoomCleaningPage';
import { HalfBathroomCleaningPage } from './pages/checklists/interactive/HalfBathroomCleaningPage';
import { FullBathroomCleaningPage } from './pages/checklists/interactive/FullBathroomCleaningPage';
import { TropicalCruisePackingPage } from './pages/checklists/interactive/TropicalCruisePackingPage';
import { ColdClimateCruisePackingPage } from './pages/checklists/interactive/ColdClimateCruisePackingPage';
import { PreTripHomePrepPage } from './pages/checklists/interactive/free/PreTripHomePrepPage';
import { AdminLinksPage } from './pages/AdminLinksPage';
import { ScrollToTop } from './components/ScrollToTop';
import { BoardGamePage } from './pages/games/BoardGamePage';
function AppLayout() {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/games/');
  return <div className="flex flex-col min-h-screen">
      {!isGamePage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/coaching" element={<CoachingPage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/free-resources" element={<FreeResourcesPage />} />
          <Route path="/free-resources/cleaning-schedule" element={<UltimateCleaningSchedulePage />} />
          
          <Route path="/free-resources/cleaning/daily" element={<DailyCleaningPage />} />
          
          <Route path="/free-resources/cleaning/weekly" element={<WeeklyCleaningPage />} />
          
          <Route path="/free-resources/cleaning/monthly" element={<MonthlyCleaningPage />} />
          
          <Route path="/free-resources/cleaning/quarterly" element={<QuarterlyCleaningPage />} />
          
          <Route path="/free-resources/cleaning/biannual" element={<BiannualCleaningPage />} />
          
          <Route path="/free-resources/cleaning/yearly" element={<YearlyCleaningPage />} />
          
          <Route path="/free-resources/self-care/daily" element={<DailySelfCarePage />} />
          
          <Route path="/checklists/cleaning/ukc-742" element={<KitchenCleaningPage />} />
          
          <Route path="/checklists/cleaning/ulrc-519" element={<LivingRoomCleaningPage />} />
          
          <Route path="/checklists/cleaning/uhbc-318" element={<HalfBathroomCleaningPage />} />
          
          <Route path="/checklists/cleaning/ufbc-273" element={<FullBathroomCleaningPage />} />
          
          <Route path="/checklists/travel/tcpl-627" element={<TropicalCruisePackingPage />} />
          
          <Route path="/checklists/travel/ccpl-451" element={<ColdClimateCruisePackingPage />} />
          
          <Route path="/free-resources/travel/home-prep" element={<PreTripHomePrepPage />} />
          
          <Route path="/workouts" element={<WorkoutPlansPage />} />
          <Route path="/checklists" element={<ChecklistsPage />} />
          <Route path="/checklists/cleaning" element={<CleaningListsPage />} />
          <Route path="/checklists/cleaning/sr-847" element={<SundayResetPage />} />
          
          <Route path="/checklists/cleaning/ctf-392" element={<CleaningTasksForgottenPage />} />
          
          <Route path="/checklists/cleaning/hme-561" element={<HotMessCleanPage />} />
          
          <Route path="/checklists/travel" element={<TravelListsPage />} />
          <Route path="/checklists/organization" element={<OrganizationListsPage />} />
          
          <Route path="/checklists/self-care" element={<SelfCareListsPage />} />
          <Route path="/checklists/hacks" element={<LifeHacksListsPage />} />
          <Route path="/app" element={<AppComingSoonPage />} />
          <Route path="/twm-admin-links" element={<AdminLinksPage />} />

          {/* GHOST LINKS - GAMES */}
          <Route path="/games/ttl-483" element={<BoardGamePage />} />
        </Routes>
      </main>
      {!isGamePage && <Footer />}
    </div>;
}
export function App() {
  // Load MailerLite Universal script globally (once)
  useEffect(() => {
    if (!(window as any).ml) {
      ;
      (window as any).ml = function () {
        ;
        ((window as any).ml.q = (window as any).ml.q || []).push(arguments);
      };
    }
    ;
    (window as any).ml('account', '2211088');
    if (!document.querySelector('script[src="https://assets.mailerlite.com/js/universal.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.mailerlite.com/js/universal.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  return <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>;
}