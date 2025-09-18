import React, { useState, useCallback } from 'react';
import { generateVirtualTryOnImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import OutfitSelector from './components/OutfitSelector';
import ResultDisplay from './components/ResultDisplay';
import Stepper from './components/Stepper';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, RefreshIcon, SparklesIcon } from './components/icons';

const STEPS = [
  { number: 1, title: 'Upload Photo' },
  { number: 2, title: 'Choose Outfit' },
  { number: 3, title: 'Add Accessories', subtitle: '(Optional)' },
  { number: 4, title: 'Pick Scenery', subtitle: '(Optional)' },
  { number: 5, title: 'Final Touches', subtitle: '(Optional)' }
];


const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [accessoryImage, setAccessoryImage] = useState<string | null>(null);
  const [sceneryImage, setSceneryImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string>('');
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length + 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const handleStartOver = () => {
    setStep(1);
    setPersonImage(null);
    setOutfitImage(null);
    setAccessoryImage(null);
    setSceneryImage(null);
    setUserPrompt('');
    setLastUsedPrompt('');
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const handleGenerate = useCallback(async (isVariation: boolean = false) => {
    if (!personImage || !outfitImage) {
      setError('Please provide your photo and an outfit to generate an image.');
      return;
    }

    const promptToUse = isVariation ? lastUsedPrompt : userPrompt;

    setStep(STEPS.length + 1); // Move to result view
    setIsLoading(true);
    setError(null);
    if(!isVariation) {
        setGeneratedImage(null);
    }
    
    // Store the prompt that is being used for this generation
    setLastUsedPrompt(promptToUse);

    try {
      const result = await generateVirtualTryOnImage(personImage, outfitImage, accessoryImage, sceneryImage, promptToUse, isVariation);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError('The AI could not generate an image. Please try a different photo or outfit.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [personImage, outfitImage, accessoryImage, sceneryImage, userPrompt, lastUsedPrompt]);

  const renderStepContent = () => {
    const currentStepInfo = STEPS[step - 1];

    if (step > STEPS.length) {
      return (
         <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-2xl mx-auto">
            {!isLoading && !error && generatedImage && (
                <div className="text-center mb-6 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
                    <strong className="font-bold flex items-center justify-center"><SparklesIcon className="w-5 h-5 mr-2"/> Success!</strong>
                    <span className="block sm:inline">Your new look has been generated.</span>
                </div>
            )}
            <ResultDisplay generatedImage={generatedImage} isLoading={isLoading} error={error} />
        </div>
      );
    }

    return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-2xl mx-auto" key={step}>
            <div className="text-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full text-white font-bold text-xl mb-4 mx-auto">{currentStepInfo.number}</div>
                <h2 className="text-xl font-bold text-center">{currentStepInfo.title} <span className="text-gray-400 font-normal">{currentStepInfo.subtitle}</span></h2>
            </div>
        
            {step === 1 && <ImageUploader onImageUpload={setPersonImage} imagePreview={personImage} title="Your Photo" />}
            {step === 2 && <OutfitSelector onOutfitSelect={setOutfitImage} selectedOutfit={outfitImage} />}
            {step === 3 && <ImageUploader onImageUpload={setAccessoryImage} imagePreview={accessoryImage} title="Accessory" />}
            {step === 4 && <ImageUploader onImageUpload={setSceneryImage} imagePreview={sceneryImage} title="Scenery" />}
            {step === 5 && (
              <div className="w-full max-w-lg mx-auto">
                <p className="text-center text-gray-400 mb-4">Describe any changes you'd like to make.</p>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g., 'make the jacket black', 'change the background to a sunny day', 'add a necklace'"
                  className="w-full h-32 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            )}
        </div>
    );
  }

  const renderNavigation = () => {
    if (step > STEPS.length) { // Result screen
      return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button onClick={() => handleGenerate(true)} disabled={isLoading} className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed">
            <RefreshIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Generate a Variation
          </button>
          <button onClick={handleStartOver} disabled={isLoading} className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 disabled:bg-indigo-800/50 disabled:cursor-not-allowed">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create a New Look
          </button>
        </div>
      );
    }

    const isNextDisabled = (step === 1 && !personImage) || (step === 2 && !outfitImage);

    return (
        <div className="flex justify-between items-center mt-6 w-full max-w-2xl mx-auto">
            {step > 1 ? (
                <button onClick={prevStep} className="flex items-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back
                </button>
            ) : <div />}

            {step < STEPS.length ? (
                 <button onClick={nextStep} disabled={isNextDisabled} className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300">
                    Next
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
            ) : (
                <button onClick={() => handleGenerate()} disabled={!personImage || !outfitImage} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-500 transition-all duration-300">
                    Generate My Look
                </button>
            )}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Stepper steps={STEPS.map(s => s.title)} currentStep={step} />
        <div className="mt-8">
            {renderStepContent()}
            {renderNavigation()}
        </div>
        {(error && step <= STEPS.length) && (
          <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-2xl mx-auto" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
