
import React, { useRef } from 'react';
import { CameraIcon, TrashIcon, PhotoIcon } from './icons';

interface ImageUploadProps {
  photo: string | null;
  onPhotoChange: (base64: string | null) => void;
  placeholderIcon: React.ReactNode;
  captureMode?: 'user' | 'environment';
}

const ImageUpload: React.FC<ImageUploadProps> = ({ photo, onPhotoChange, placeholderIcon, captureMode = 'environment' }) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
        {photo ? (
          <img src={photo} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          placeholderIcon
        )}
      </div>
      <div className="flex items-center space-x-2">
         <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center space-x-2 text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors"
        >
          <CameraIcon className="h-5 w-5" />
          <span>Camera</span>
        </button>
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="flex items-center space-x-2 text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors"
        >
          <PhotoIcon className="h-5 w-5" />
          <span>Gallery</span>
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => onPhotoChange(null)}
            className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture={captureMode}
      />
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ImageUpload;