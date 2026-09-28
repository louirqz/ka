import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { AdminPasscodeModal } from './components/common/AdminPasscodeModal';
import { PrivacyModal } from './components/common/PrivacyModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { MakeupPage } from './pages/MakeupPage';
import { HairstylePage } from './pages/HairstylePage';
import { OutfitsPage } from './pages/OutfitsPage';
import { OccasionPage } from './pages/OccasionPage';
import { FestivalPage } from './pages/FestivalPage';
import { StylesPage } from './pages/StylesPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminDataManagement } from './pages/admin/AdminDataManagement';
import { AdminSettingsLogs } from './pages/admin/AdminSettingsLogs';

// Services & Types
import { StorageService } from './services/storage';
import { AuthService } from './services/authService';
import { User } from './types';

export default function App() {
  // Sync router with window location hash/path
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/home';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [savedCount, setSavedCount] = useState<number>(() => StorageService.getSavedLooks().length);
  const [adminPasscodeModalOpen, setAdminPasscodeModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Sync route on hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string, options?: any) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSavedCount = () => {
    setSavedCount(StorageService.getSavedLooks().length);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate('/home');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    handleUpdateSavedCount();
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-pink-500 selection:text-white">
      {/* Global Modals */}
      <AdminPasscodeModal
        isOpen={adminPasscodeModalOpen}
        onClose={() => setAdminPasscodeModalOpen(false)}
        onSuccess={() => {
          setCurrentUser(StorageService.getCurrentUser());
          navigate('/admin/dashboard');
        }}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        onConfirm={() => navigate('/analyze')}
      />

      {/* Conditional Header: Only for standard user pages */}
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
          currentUser={currentUser}
          onOpenAdminPasscode={() => setAdminPasscodeModalOpen(true)}
          onLogout={handleLogout}
          savedCount={savedCount}
        />
      )}

      {/* Main Content View Container */}
      <div className="flex-1">
        {/* User Route Switch */}
        {!isAdminRoute ? (
          <>
            {currentPath === '/' || currentPath === '/home' ? (
              <HomePage
                onNavigate={navigate}
                onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
              />
            ) : currentPath === '/analyze' ? (
              <AnalyzePage onNavigate={navigate} />
            ) : currentPath === '/analysis-result' ? (
              <AnalysisResultPage
                onNavigate={navigate}
                onSaveLook={handleUpdateSavedCount}
              />
            ) : currentPath === '/makeup' ? (
              <MakeupPage onNavigate={navigate} />
            ) : currentPath === '/hairstyle' ? (
              <HairstylePage onNavigate={navigate} />
            ) : currentPath === '/outfits' ? (
              <OutfitsPage onNavigate={navigate} onSaveLook={handleUpdateSavedCount} />
            ) : currentPath === '/occasion' ? (
              <OccasionPage onNavigate={navigate} />
            ) : currentPath === '/festival' ? (
              <FestivalPage onNavigate={navigate} />
            ) : currentPath === '/style' ? (
              <StylesPage onNavigate={navigate} />
            ) : currentPath === '/saved' ? (
              <SavedPage onNavigate={navigate} onUpdateCount={handleUpdateSavedCount} />
            ) : currentPath === '/profile' ? (
              <ProfilePage
                onNavigate={navigate}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            ) : currentPath === '/about' ? (
              <AboutPage onNavigate={navigate} />
            ) : currentPath === '/login' ? (
              <LoginPage
                onNavigate={navigate}
                onLoginSuccess={handleLoginSuccess}
                onOpenAdminPasscode={() => setAdminPasscodeModalOpen(true)}
              />
            ) : currentPath === '/register' ? (
              <RegisterPage
                onNavigate={navigate}
                onRegisterSuccess={handleLoginSuccess}
              />
            ) : (
              <HomePage
                onNavigate={navigate}
                onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
              />
            )}
          </>
        ) : (
          /* Admin Backoffice Views with security guard in AdminLayout */
          <AdminLayout
            currentPath={currentPath}
            onNavigate={navigate}
            currentUser={currentUser}
            onOpenAdminPasscode={() => setAdminPasscodeModalOpen(true)}
            onLogout={handleLogout}
          >
            {currentPath === '/admin' || currentPath === '/admin/dashboard' ? (
              <AdminDashboard />
            ) : currentPath === '/admin/users' ? (
              <AdminUsers />
            ) : currentPath === '/admin/makeup' ||
              currentPath === '/admin/hairstyles' ||
              currentPath === '/admin/outfits' ||
              currentPath === '/admin/occasions' ||
              currentPath === '/admin/festivals' ||
              currentPath === '/admin/styles' ? (
              <AdminDataManagement />
            ) : currentPath === '/admin/logs' || currentPath === '/admin/settings' ? (
              <AdminSettingsLogs />
            ) : (
              <AdminDashboard />
            )}
          </AdminLayout>
        )}
      </div>

      {/* Footer (User Views only) */}
      {!isAdminRoute && (
        <Footer
          onNavigate={navigate}
          onOpenAdminPasscode={() => setAdminPasscodeModalOpen(true)}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      {!isAdminRoute && (
        <BottomNav
          currentPath={currentPath}
          onNavigate={navigate}
          savedCount={savedCount}
        />
      )}
    </div>
  );
}
