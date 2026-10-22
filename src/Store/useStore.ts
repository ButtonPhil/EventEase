// src/stores/useStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AppEvent } from '../Types';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  currentUser: User | null;
  events: AppEvent[];
  theme: ThemeMode;
  participations: Record<string, string[]>;

  login: (user: User) => void;
  logout: () => void;
  setTheme: (theme: ThemeMode) => void;

  addEvent: (event: AppEvent) => void;
  updateEvent: (id: string, updatedData: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleParticipation: (eventId: string) => void;
  isUserParticipating: (eventId: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      events: [],
      theme: 'system',
      participations: {},

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      setTheme: (theme) => set({ theme }),

      addEvent: (event) => set((state) => ({
        events: [...state.events, event]
      })),

      updateEvent: (id, updatedData) => set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, ...updatedData } : e)
      })),

      deleteEvent: (id) => set((state) => {
        const newParticipations = { ...state.participations };
        for (const userId in newParticipations) {
          newParticipations[userId] = newParticipations[userId].filter((eid) => eid !== id);
        }
        return {
          events: state.events.filter((e) => e.id !== id),
          participations: newParticipations,
        };
      }),

      toggleParticipation: (eventId) => set((state) => {
        if (!state.currentUser) return state;
        const userId = state.currentUser.id;
        const userParticipations = state.participations[userId] || [];
        
        const isParticipating = userParticipations.includes(eventId);
        
        return {
          participations: {
            ...state.participations,
            [userId]: isParticipating
              ? userParticipations.filter((id) => id !== eventId)
              : [...userParticipations, eventId],
          },
        };
      }),

      isUserParticipating: (eventId) => {
        const state = get();
        if (!state.currentUser) return false;
        const userParticipations = state.participations[state.currentUser.id] || [];
        return userParticipations.includes(eventId);
      },
    }),
    {
      name: 'event-ease-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);