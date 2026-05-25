'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequestWithAuth, getStoredAccessToken } from '@/lib/api';

export type ProfileData = {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  language: string;
  rating: string;
  reviews: number;
  tutorType: string;
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
  name: '',
  fullName: '',
  email: '',
  phone: '',
  language: '',
  rating: '',
  reviews: 0,
  tutorType: '',
  experience: '',
  joinDate: '',
  bio: '',
  subjects: [],
  locations: [],
  skills: [],
  days: [],
  credentials: [],
  avatarUrl: null,
  notifications: [],
};

type ProfileContextType = {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      return;
    }

    apiRequestWithAuth<{
      id: string;
      fullName: string;
      email: string;
      phone: string | null;
      status: string;
      tutorType?: string;
      subjects: string[];
      districts: string[];
    }>("/tutor/profile")
      .then((data) => {
        setProfile((prev) => ({
          ...prev,
          name: data.fullName,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone ?? prev.phone,
          tutorType: data.tutorType ?? prev.tutorType,
          subjects: data.subjects.length > 0 ? data.subjects : prev.subjects,
          locations: data.districts.length > 0
            ? data.districts.map((district, index) => ({
                name: district,
                color: index % 2 === 0 ? '#10B981' : '#3B82F6',
              }))
            : prev.locations,
        }));
      })
      .catch(() => undefined);
  }, []);

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
