import React from 'react';
import Joyride, { Step } from 'react-joyride';

interface TourProps {
  children: React.ReactNode;
  steps: Step[];
  isOpen: boolean
}

const Tour: React.FC<TourProps> = ({ children, steps, isOpen }) => {


  return (
    <>
      <Joyride
        steps={steps}
        run={isOpen}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        disableOverlayClose
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
