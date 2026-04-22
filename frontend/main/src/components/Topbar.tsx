'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';

export default function Topbar() {
  const { profile, setProfile } = useProfile();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = profile.notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      const updatedNotifs = profile.notifications.map(n => ({ ...n, read: true }));
      setProfile({ ...profile, notifications: updatedNotifs });
    }
  };

  return (
    <div className="topbar">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Tìm kiếm lớp học..." />
      </div>
      <div className="topbar-right">

        <div className="topbar-icon" style={{ position: 'relative' }} ref={notifRef}>
          <div onClick={handleNotifClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%' }}></span>
            )}
          </div>
          
          {isNotifOpen && (
            <div style={{ position: 'absolute', top: '50px', right: '-10px', width: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden', textAlign: 'left' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Thông báo</h3>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {profile.notifications?.length > 0 ? profile.notifications.map(val => (
                  <div key={val.id} style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'flex-start', background: val.read ? '#fff' : '#f8fafc' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>{val.message}</p>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{val.time}</span>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Không có thông báo mới</div>
                )}
              </div>
            </div>
          )}
        </div>

        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="Avatar" className="avatar" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', padding: 0 }} />
        ) : (
          <div className="avatar">{profile.name.charAt(0).toUpperCase()}</div>
        )}
      </div>
    </div>
  );
}
