'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { apiRequestWithAuth } from '@/lib/api';

export default function TutorLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('sne_user');
    if (!raw) return;

    try {
      const user = JSON.parse(raw) as { mustChangePassword?: boolean };
      if (user.mustChangePassword && pathname !== '/tai-khoan-gia-su/doi-mat-khau') {
        window.location.replace('/tai-khoan-gia-su/doi-mat-khau');
      }
    } catch {
      // Ignore malformed session state.
    }
  }, [pathname]);

  useEffect(() => {
    const checkSession = () => {
      void apiRequestWithAuth<{ user: unknown }>('/auth/me').catch(() => undefined);
    };

    const checkVisibleSession = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    checkSession();
    const intervalId = window.setInterval(checkSession, 15_000);
    window.addEventListener('focus', checkSession);
    document.addEventListener('visibilitychange', checkVisibleSession);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', checkSession);
      document.removeEventListener('visibilitychange', checkVisibleSession);
    };
  }, []);

  return (
    <div className="layout">
      {/* Mobile overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="main-content">
        <div className="mobile-header-actions">
           <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
             <i className="fas fa-bars"></i>
           </button>
           <span className="mobile-brand">SONG NGUYEN</span>
        </div>
        
        <Topbar />
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
