import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ProfileProvider } from '@/context/ProfileContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Topbar />
          <div className="page-content">{children}</div>
        </main>
      </div>
    </ProfileProvider>
  );
}
