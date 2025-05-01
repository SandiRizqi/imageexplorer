import React from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface TourProps {
  children: React.ReactNode;
  steps: Step[];
  isOpen: boolean;
  onClose: () => void;
}

const Tour: React.FC<TourProps> = ({ children, steps, isOpen, onClose }) => {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, type } = data;
    
    // Close tour when close button is clicked or tour is finished
    if (action === 'close' || type === 'tour:end') {
      onClose();
    }
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={isOpen}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        disableOverlayClose={false} // Changed to allow overlay close
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 50,
            arrowColor: 'rgba(0, 0, 0, 0.6)',
            backgroundColor: '#333',
            overlayColor: 'rgba(0, 0, 0, 0.9)',
            primaryColor: '#6cda00',
            textColor: '#fff',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip Tour',
        }}
      />
      {children}
    </>
  );
};

export default Tour;