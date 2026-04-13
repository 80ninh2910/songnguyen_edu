import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SONG NGUYEN EDU',
  description: 'Cổng Gia Sư Cao Cấp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="/tutor/css/global.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
