'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function TutorLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
