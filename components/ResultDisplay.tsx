import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';
import { DownloadIcon, ImageIcon } from './icons';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingIndicator: React.FC = () => {
    const [message, setMessage] = useState(LOADING_MESSAGES[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = LOADING_MESSAGES.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
                return LOADING_MESSAGES[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto mb-4"></div>
            <p className="font-semibold text-lg text-indigo-300">Creating your look...</p>
            <p className="text-gray-400 transition-opacity duration-500">{message}</p>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading, error }) => {
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'virtual-try-on-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (error) {
       return (
        <div className="text-center p-4">
            <ImageIcon className="w-16 h-16 mx-auto text-red-500 mb-2" />
            <p className="font-semibold text-red-300">Generation Failed</p>
            <p className="text-sm text-gray-400">{error}</p>
        </div>
       );
    }
    if (generatedImage) {
      return (
        <div className="relative group w-full h-full">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-lg"></div>
          <img src={generatedImage} alt="Generated result" className="relative w-full h-full object-contain rounded-lg z-10" />
          <button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20"
            aria-label="Download Image"
          >
            <DownloadIcon className="w-6 h-6" />
          </button>
        </div>
      );
    }
    return (
      <div className="text-center p-4">
        <ImageIcon className="w-16 h-16 mx-auto text-gray-500 mb-2" />
        <p className="font-semibold text-gray-300">Your generated image will appear here.</p>
        <p className="text-sm text-gray-400">Click "Generate My Look" to start.</p>
      </div>
    );
  };
  
  return (
    <div className="w-full aspect-square bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 flex items-center justify-center p-2">
      {renderContent()}
    </div>
  );
};

export default ResultDisplay;