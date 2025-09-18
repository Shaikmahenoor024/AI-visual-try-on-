import React, { useState } from 'react';
import type { Outfit } from '../types';
import { PREDEFINED_OUTFITS } from '../constants';
import ImageUploader from './ImageUploader';

interface OutfitSelectorProps {
  selectedOutfit: string | null;
  onOutfitSelect: (base64OrUrl: string) => void;
}

type Tab = 'predefined' | 'custom';

const OutfitSelector: React.FC<OutfitSelectorProps> = ({ selectedOutfit, onOutfitSelect }) => {
  const [activeTab, setActiveTab] = useState<Tab>('predefined');

  const customImageIsSelected = selectedOutfit && selectedOutfit.startsWith('data:image');
  
  const handleCustomUpload = (base64: string) => {
    onOutfitSelect(base64);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-center border-b border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab('predefined')}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'predefined' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Pre-defined
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'custom' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Upload Custom
        </button>
      </div>

      {activeTab === 'predefined' && (
        <div className="grid grid-cols-2 gap-4">
          {PREDEFINED_OUTFITS.map((outfit: Outfit) => (
            <div
              key={outfit.name}
              className={`relative rounded-lg cursor-pointer overflow-hidden transition-all duration-300 transform hover:scale-105 ${selectedOutfit === outfit.base64 ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent'}`}
              onClick={() => onOutfitSelect(outfit.base64)}
            >
              <img src={outfit.base64} alt={outfit.name} className="w-full h-full object-cover aspect-square" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center">
                <p className="text-xs font-medium text-white truncate">{outfit.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'custom' && (
         <ImageUploader 
            onImageUpload={handleCustomUpload}
            imagePreview={customImageIsSelected ? selectedOutfit : null}
            title="Custom Outfit"
         />
      )}
    </div>
  );
};

export default OutfitSelector;
