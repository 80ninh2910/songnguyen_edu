import TutorLayoutWrapper from '@/components/TutorLayoutWrapper';
import { ProfileProvider } from '@/context/ProfileContext';
import "./tutor-layout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <TutorLayoutWrapper>
        {children}
      </TutorLayoutWrapper>
    </ProfileProvider>
  );
}
