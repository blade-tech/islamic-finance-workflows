'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlayCircle, Rocket, Video } from 'lucide-react';

interface WelcomeModalProps {
  onStartTour: () => void;
  onSkip: () => void;
}

const WELCOME_MODAL_KEY = 'zeroh-welcome-modal-shown';

export function WelcomeModal({ onStartTour, onSkip }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem(WELCOME_MODAL_KEY);

    if (!hasSeenWelcome) {
      // Show modal after a brief delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleStartTour = () => {
    localStorage.setItem(WELCOME_MODAL_KEY, 'true');
    setIsOpen(false);
    onStartTour();
  };

  const handleSkip = () => {
    localStorage.setItem(WELCOME_MODAL_KEY, 'true');
    setIsOpen(false);
    onSkip();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full">
            <span className="text-3xl">🕌</span>
          </div>
          <DialogTitle className="text-2xl text-center">
            Welcome to ZeroH Islamic Finance Workflows
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Create Shariah-compliant financial products with AI-powered compliance checking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          {/* Recommended: Take Guided Tour */}
          <button
            onClick={handleStartTour}
            className="w-full p-4 text-left border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-emerald-900">
                    Take 2-Minute Guided Tour
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-emerald-800">
                  Interactive walkthrough of key features and workflows
                </p>
              </div>
            </div>
          </button>

          {/* Jump to Live Demo */}
          <button
            onClick={handleSkip}
            className="w-full p-4 text-left border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <PlayCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Jump to Live Demo
                </h3>
                <p className="text-sm text-gray-600">
                  Explore the platform on your own
                </p>
              </div>
            </div>
          </button>

          {/* Watch Overview Video */}
          <button
            onClick={handleSkip}
            className="w-full p-4 text-left border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors group"
            disabled
          >
            <div className="flex items-start gap-3 opacity-60">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    Watch Overview Video
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  30-second introduction video
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-gray-500">
            You can restart the tour anytime from the help menu
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook to check if user has completed the welcome flow
 */
export function useHasSeenWelcome(): boolean {
  const [hasSeen, setHasSeen] = useState(true); // Default to true to avoid flash

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_MODAL_KEY);
    setHasSeen(!!hasSeenWelcome);
  }, []);

  return hasSeen;
}

/**
 * Utility to reset the welcome modal (for testing/debugging)
 */
export function resetWelcomeModal(): void {
  localStorage.removeItem(WELCOME_MODAL_KEY);
}
