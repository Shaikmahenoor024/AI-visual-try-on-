import React, { useRef } from 'react';
import { UserCircleIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  title: string;
  imagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div
        className="w-full max-w-sm mx-auto aspect-square bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-700 transition-all duration-300"
        onClick={handleClick}
      >
        {imagePreview ? (
          <img src={imagePreview} alt={title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center p-4">
            <UserCircleIcon className="w-16 h-16 mx-auto text-gray-500 mb-2" />
            <p className="font-semibold text-gray-300">Click to upload</p>
            <p className="text-sm text-gray-400">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
