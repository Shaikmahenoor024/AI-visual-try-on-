import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-700" aria-hidden="true"></div>
        <div 
          className="absolute left-0 top-1/2 h-0.5 bg-indigo-600 transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (steps.length -1)) * 100}%` }}
        ></div>
        <ul className="relative flex justify-between w-full">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isCurrent = currentStep === stepNumber;
            
            return (
              <li key={label} className="text-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
                    isCompleted ? 'bg-indigo-600 text-white' : 
                    isCurrent ? 'bg-indigo-600 ring-4 ring-indigo-500/50 text-white' : 
                    'bg-gray-700 text-gray-400'
                  }`}
                >
                  {stepNumber}
                </div>
                <span className={`mt-2 block text-xs font-semibold ${isCurrent || isCompleted ? 'text-white' : 'text-gray-500'}`}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Stepper;
