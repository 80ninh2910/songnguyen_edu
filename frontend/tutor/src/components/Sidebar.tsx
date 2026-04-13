'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>SONG NGUYEN EDU</h2>
        <span>Cổng Gia Sư Cao Cấp</span>
      </div>
      <nav className="sidebar-nav">
        <Link href="/" className={pathname === '/' ? 'active' : ''}><i className="fas fa-th-large"></i> Bảng Điều Khiển</Link>
        <Link href="/class-list" className={pathname === '/class-list' ? 'active' : ''}><i className="fas fa-chalkboard"></i> Danh Sách Lớp</Link>
        <Link href="/my-classes" className={pathname === '/my-classes' ? 'active' : ''}><i className="fas fa-graduation-cap"></i> Lớp Của Tôi</Link>
        <Link href="/profile" className={pathname === '/profile' ? 'active' : ''}><i className="fas fa-user"></i> Hồ Sơ</Link>
      </nav>
      <div className="sidebar-bottom">
        <button className="btn-new-lesson"><i className="fas fa-plus"></i> Bài Giảng Mới</button>
        <Link href="#"><i className="fas fa-question-circle"></i> Trung Tâm Hỗ Trợ</Link>
        <Link href="#"><i className="fas fa-sign-out-alt"></i> Đăng Xuất</Link>
      </div>
    </aside>
  );
}
