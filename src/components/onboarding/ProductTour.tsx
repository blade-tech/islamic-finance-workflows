'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS } from 'react-joyride';
import { tourSteps, tourStyles, tourLocale } from '@/lib/tour-steps';

interface ProductTourProps {
  /** Whether to run the tour automatically */
  run: boolean;
  /** Optional custom steps (if not provided, uses default tourSteps) */
  steps?: any[];
  /** Callback when tour is completed or skipped */
  onComplete?: () => void;
  /** Callback when tour state changes */
  onStateChange?: (isRunning: boolean) => void;
}

const TOUR_COMPLETED_KEY = 'zeroh-tour-completed';

export function ProductTour({ run, steps, onComplete, onStateChange }: ProductTourProps) {
  const [runTour, setRunTour] = useState(false);

  // Use custom steps if provided, otherwise use default tourSteps
  const activeSteps = steps && steps.length > 0 ? steps : tourSteps;

  useEffect(() => {
    setRunTour(run);
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action } = data;

    // Handle tour completion
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      onStateChange?.(false);

      // Show completion modal or message
      if (status === STATUS.FINISHED) {
        showCompletionToast();
      }

      onComplete?.();
    }

    // Track tour navigation events
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const stepIndex = data.index;
      console.log(`[ProductTour] Step ${stepIndex + 1} of ${activeSteps.length}`);

      // Log analytics event (can be replaced with actual analytics)
      trackTourEvent('tour_step_viewed', {
        step_number: stepIndex + 1,
        step_name: activeSteps[stepIndex]?.target || 'unknown',
      });
    }

    // Handle skip button
    if (action === ACTIONS.SKIP) {
      trackTourEvent('tour_skipped', { at_step: data.index + 1 });
    }

    // Handle close button
    if (action === ACTIONS.CLOSE) {
      trackTourEvent('tour_closed', { at_step: data.index + 1 });
    }

    // Update running state
    if (type === EVENTS.TOUR_START) {
      onStateChange?.(true);
      trackTourEvent('tour_started');
    }

    if (type === EVENTS.TOUR_END) {
      onStateChange?.(false);
      if (status === STATUS.FINISHED) {
        trackTourEvent('tour_completed');
      }
    }
  };

  return (
    <Joyride
      steps={activeSteps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      disableCloseOnEsc={false}
      spotlightPadding={8}
      spotlightClicks={true}
      callback={handleJoyrideCallback}
      styles={tourStyles}
      locale={tourLocale}
      floaterProps={{
        disableAnimation: false,
        styles: {
          arrow: {
            length: 8,
            spread: 16,
          },
        },
      }}
    />
  );
}

/**
 * Hook to check if user has completed the tour
 */
export function useHasCompletedTour(): boolean {
  const [hasCompleted, setHasCompleted] = useState(true); // Default to true to avoid flash

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    setHasCompleted(!!tourCompleted);
  }, []);

  return hasCompleted;
}

/**
 * Utility to reset tour completion (for testing/debugging)
 */
export function resetTour(): void {
  localStorage.removeItem(TOUR_COMPLETED_KEY);
}

/**
 * Helper function to show completion toast/modal
 */
function showCompletionToast() {
  // This could be replaced with your toast system
  console.log('[ProductTour] Tour completed! 🎉');

  // You can integrate with your toast system here
  // For now, we'll use a simple notification
  if (typeof window !== 'undefined') {
    // Create a simple completion notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-up';
    notification.innerHTML = `
      <span class="text-2xl">✓</span>
      <div>
        <p class="font-semibold">Tour Complete!</p>
        <p class="text-sm text-emerald-100">You've seen the key features</p>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

/**
 * Track tour events (placeholder for analytics integration)
 */
function trackTourEvent(eventName: string, properties?: Record<string, any>) {
  // This is a placeholder for your analytics integration
  // Replace with your actual analytics service (GA4, Plausible, etc.)
  console.log(`[Analytics] ${eventName}`, properties);

  // Example integration with Google Analytics:
  // if (window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }

  // Example integration with Plausible:
  // if (window.plausible) {
  //   window.plausible(eventName, { props: properties });
  // }
}

/**
 * Tour completion modal content (for future use)
 */
export function TourCompletionModal() {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-3xl">✓</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Tour Complete!</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p>You've seen the key features:</p>
        <ul className="list-none space-y-1">
          <li>✓ Shariah methodology connection</li>
          <li>✓ Structure selection & guidance</li>
          <li>✓ AI-powered compliance analysis</li>
          <li>✓ Multi-stakeholder collaboration</li>
        </ul>
      </div>
      <div className="flex gap-2 justify-center pt-2">
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
          Explore Freely
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Restart Tour
        </button>
      </div>
    </div>
  );
}
