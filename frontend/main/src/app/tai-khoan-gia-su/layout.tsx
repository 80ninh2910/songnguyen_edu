import TutorLayoutWrapper from '@/components/TutorLayoutWrapper';
import { ProfileProvider } from '@/context/ProfileContext';
import "./tutor-layout.css";
import "./styles/class-list.css";
import "./styles/class-detail.css";
import "./styles/my-classes.css";
import "./styles/profile.css";
import "./styles/session-list.css";
import "./styles/session-form.css";
import "./styles/session-feedback.css";
import "./styles/student-progress.css";
import "./styles/change-password.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <TutorLayoutWrapper>
        {children}
      </TutorLayoutWrapper>
    </ProfileProvider>
  );
}
