'use client';

import React, { createContext, useContext, useState } from 'react';

export type ProfileData = {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  language: string;
  rating: string;
  reviews: number;
  status: string;
  experience: string;
  joinDate: string;
  bio: string;
  subjects: string[];
  locations: { name: string; color: string }[];
  skills: string[];
  days: { label: string; available: boolean }[];
  credentials: any[];
  avatarUrl: string | null;
  notifications: { id: string; message: string; time: string; read: boolean }[];
};

const defaultProfile: ProfileData = {
  name: 'Nguyễn Hải Vân',
  fullName: 'Nguyễn Hải Vân',
  email: 'haivan@songnguyen.edu.vn',
  phone: '+84 (0) 909 234 890',
  language: 'Tiếng Việt (Bản ngữ), Tiếng Anh (Thành thạo)',
  rating: '5.0',
  reviews: 124,
  status: 'Gia Sư Chính Thức',
  experience: '3 Năm tại Trung tâm',
  joinDate: '15/09/2021',
  bio: 'Tốt nghiệp Đại học Bách Khoa TP.HCM, chuyên ngành Vật lý Ứng dụng. Đã giảng dạy tại Trung tâm Song Nguyên từ năm 2021. Phong cách giảng dạy tập trung vào tư duy logic và ứng dụng thực tế. Yêu thích việc truyền cảm hứng học tập cho học sinh.',
  subjects: ['Toán', 'Vật lý', 'Tiếng Anh'],
  locations: [
    { name: 'Quận 7, TP.HCM', color: '#10B981' },
    { name: 'Quận 4, TP.HCM', color: '#3B82F6' }
  ],
  skills: [
    'Toán THPT',
    'Vật lý cơ bản & nâng cao',
    'Luyện thi Đại học',
    'Tiếng Anh giao tiếp',
    'Quản lý lớp học',
    'Hỗ trợ cá nhân',
  ],
  days: [
    { label: 'T2', available: true },
    { label: 'T3', available: true },
    { label: 'T4', available: false },
    { label: 'T5', available: true },
    { label: 'T6', available: true },
    { label: 'T7', available: true },
    { label: 'CN', available: false },
  ],
  credentials: [
    {
      icon: 'id-card',
      title: 'Xác Minh Danh Tính',
      detail: 'CMND/CCCD • Đã xác minh',
      imageUrl: undefined,
    },
    {
      icon: 'graduation-cap',
      title: 'Bằng Cử Nhân',
      detail: 'ĐH Bách Khoa TP.HCM • Đã xác minh',
    },
  ],
  avatarUrl: null,
  notifications: [
    { id: 'welcome-1', message: 'Chào mừng bạn quay trở lại Cổng Gia Sư Song Nguyên!', time: 'Hôm nay', read: false }
  ],
};

type ProfileContextType = {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
