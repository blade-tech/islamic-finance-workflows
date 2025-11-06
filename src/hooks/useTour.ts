'use client';

import { create } from 'zustand';

interface TourState {
  runTour: boolean;
  startTour: () => void;
  stopTour: () => void;
  resetTour: () => void;
}

/**
 * Global tour state management using Zustand
 * Allows any component to start/stop the product tour
 */
export const useTourStore = create<TourState>((set) => ({
  runTour: false,
  startTour: () => set({ runTour: true }),
  stopTour: () => set({ runTour: false }),
  resetTour: () => {
    // Clear localStorage and restart tour
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zeroh-welcome-modal-shown');
      localStorage.removeItem('zeroh-tour-completed');
    }
    set({ runTour: true });
  },
}));

/**
 * Hook to access tour state and controls
 */
export function useTour() {
  const { runTour, startTour, stopTour, resetTour } = useTourStore();
  return { runTour, startTour, stopTour, resetTour };
}
