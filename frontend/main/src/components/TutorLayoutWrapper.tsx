'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

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
