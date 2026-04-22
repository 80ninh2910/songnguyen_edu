'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
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
    // We use window.location.replace instead of router.replace to force a full hard reload.
    // This is required to prevent CSS leakage because the tutor layout injects a global 
    // <link rel="stylesheet" href="/css/global.css" /> into the <head> which Next.js 
    // router soft-navigation does not cleanly remove, causing the homepage layout to break.
    window.location.replace('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>SONG NGUYEN EDU</h2>
        <span>Cổng Gia Sư Cao Cấp</span>
      </div>
      <nav className="sidebar-nav">
        <Link href="/tutor" className={pathname === '/tutor' ? 'active' : ''}><i className="fas fa-th-large"></i> Bảng Điều Khiển</Link>
        <Link href="/tutor/class-list" className={pathname === '/tutor/class-list' ? 'active' : ''}><i className="fas fa-chalkboard"></i> Danh Sách Lớp</Link>
        <Link href="/tutor/my-classes" className={pathname === '/tutor/my-classes' ? 'active' : ''}><i className="fas fa-graduation-cap"></i> Lớp Của Tôi</Link>
        <Link href="/tutor/profile" className={pathname === '/tutor/profile' ? 'active' : ''}><i className="fas fa-user"></i> Hồ Sơ</Link>
      </nav>
      <div className="sidebar-bottom">
        <button className="btn-new-lesson"><i className="fas fa-plus"></i> Bài Giảng Mới</button>

        <a href="#" onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Đăng Xuất</a>
      </div>
    </aside>
  );
}
