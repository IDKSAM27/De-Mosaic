// src/app/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react'; // For some cool icons

// A new, reusable component for our creative loading animation
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="flex space-x-2">
      <div className="h-3 w-3 animate-pulse rounded-full bg-purple-400 [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-purple-400 [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-purple-400"></div>
    </div>
    <p className="text-sm text-gray-400">The AI is thinking...</p>
  </div>
);

// A new, reusable component for a placeholder before images are loaded
const ImagePlaceholder = ({ title }: { title: string }) => (
  <div className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-700 bg-gray-800/50 p-12 text-center">
    <ImageIcon className="h-10 w-10 text-gray-600" />
    <p className="mt-2 text-sm font-semibold text-gray-500">{title}</p>
  </div>
);

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const processImageMutation = api.image.process.useMutation();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        processImageMutation.reset(); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessClick = () => {
    if (selectedImage) {
      processImageMutation.mutate({ imageBase64: selectedImage });
    } else {
      alert("Please upload an image first.");
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 p-4 text-white sm:p-8 md:p-12">
      <div className="w-full max-w-5xl">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            AI Mosaic <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Restoration</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Upload an image to see the magic. Our AI will intelligently reconstruct censored areas.
          </p>
        </header>

        {/* Upload and Process Section */}
        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <label htmlFor="file_input" className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-600">
            <Upload className="h-5 w-5" />
            <span>Choose Image</span>
          </label>
          <input 
            id="file_input" 
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button 
            onClick={handleProcessClick}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-bold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-500"
            disabled={!selectedImage || processImageMutation.isPending}
          >
            <Sparkles className="h-5 w-5" />
            <span>{processImageMutation.isPending ? "Processing..." : "Restore Image"}</span>
          </button>
        </div>
        
        {/* Image Display Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Original Image Card */}
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-300">Original</h2>
            <div className="relative h-full min-h-[250px] w-full">
              {selectedImage ? (
                <img src={selectedImage} alt="Original" className="h-full w-full rounded-2xl object-cover shadow-lg transition-opacity duration-500 animate-in fade-in" />
              ) : (
                <ImagePlaceholder title="Upload an Image" />
              )}
            </div>
          </div>

          {/* Processed Image Card */}
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-300">Restored</h2>
            <div className="relative flex h-full min-h-[250px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-transparent bg-gray-800/50 backdrop-blur-sm">
              {/* Shimmer effect for loading state */}
              {processImageMutation.isPending && (
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"></div>
              )}
              
              {processImageMutation.isPending && <LoadingSpinner />}
              {processImageMutation.isError && <p className="p-4 text-center text-red-400">Error: {processImageMutation.error.message}</p>}
              {processImageMutation.data ? (
                <img src={processImageMutation.data.processedImage} alt="Processed" className="h-full w-full rounded-2xl object-cover shadow-lg transition-opacity duration-500 animate-in fade-in" />
              ) : (
                !processImageMutation.isPending && <ImagePlaceholder title="Result will appear here" />
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
