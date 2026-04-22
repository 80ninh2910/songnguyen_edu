import TutorLayoutWrapper from '@/components/TutorLayoutWrapper';
import { ProfileProvider } from '@/context/ProfileContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/global.css" />
      </head>
      <TutorLayoutWrapper>
        {children}
      </TutorLayoutWrapper>
    </ProfileProvider>
  );
}
