'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  {
    title: 'Create Event',
    text: 'Set up your first event, configure ticket tiers, and publish.',
  },
  {
    title: 'Manage Events',
    text: 'View active events, edit details, and monitor sales.',
  },
  {
    title: 'Analytics',
    text: 'Track revenue trends, attendee demographics, and conversion.',
  },
  { title: 'Verification', text: 'Use QR scan tools for seamless gate check-ins.' },
];

export default function OnboardingTour({ forceShow = false }: { forceShow?: boolean }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem('onboarding_tour_seen');
    if (!seen || forceShow) {
      setActiveStep(0);
    }
  }, [forceShow]);

  if (activeStep === null) return null;

  const current = STEPS[activeStep];

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      localStorage.setItem('onboarding_tour_seen', 'true');
      setActiveStep(null);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_tour_seen', 'true');
    setActiveStep(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-dark border border-white/20 rounded-xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Step {activeStep + 1} of {STEPS.length}
          </span>
          <button onClick={handleSkip} className="text-xs text-gray-400 hover:text-white">
            Skip
          </button>
        </div>
        <h3 className="text-lg font-bold">{current.title}</h3>
        <p className="text-sm text-gray-300">{current.text}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
          >
            {activeStep === STEPS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
