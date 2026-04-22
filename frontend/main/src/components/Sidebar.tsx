'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 1. Clear all auth-related state completely (localStorage, sessionStorage)
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      // 2. Remove token, session, cookies
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    } catch (err) {
      console.error("Error clearing auth state:", err);
    }

    // 3. Clean redirect to homepage
    window.location.replace('/');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-brand">
        <h2>SONG NGUYEN EDU</h2>
        <span>Cổng Gia Sư Cao Cấp</span>
        {onClose && (
          <button className="sidebar-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        <Link href="/tutor" className={pathname === '/tutor' ? 'active' : ''} onClick={onClose}><i className="fas fa-th-large"></i> Bảng Điều Khiển</Link>
        <Link href="/tutor/class-list" className={pathname === '/tutor/class-list' ? 'active' : ''} onClick={onClose}><i className="fas fa-chalkboard"></i> Danh Sách Lớp</Link>
        <Link href="/tutor/my-classes" className={pathname === '/tutor/my-classes' ? 'active' : ''} onClick={onClose}><i className="fas fa-graduation-cap"></i> Lớp Của Tôi</Link>
        <Link href="/tutor/profile" className={pathname === '/tutor/profile' ? 'active' : ''} onClick={onClose}><i className="fas fa-user"></i> Hồ Sơ</Link>
      </nav>
      <div className="sidebar-bottom">
        <button className="btn-new-lesson"><i className="fas fa-plus"></i> Bài Giảng Mới</button>

        <a href="#" onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Đăng Xuất</a>
      </div>
    </aside>
  );
}
