// src/app/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  const processImageMutation = api.image.process.useMutation({
    onSuccess: (data) => {
      setProcessedImage(data.processedImage);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
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
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-24">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">
        AI Mosaic <span className="text-[hsl(280,100%,70%)]">Remover</span>
      </h1>
      
      <div className="w-full max-w-lg">
        <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="file_input">Upload file</label>
        <input 
          className="block w-full text-sm text-gray-400 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none placeholder-gray-400" 
          id="file_input" 
          type="file" 
          accept="image/*"
          onChange={handleImageUpload}
        />
        <button 
          onClick={handleProcessClick}
          className="mt-4 w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-500"
          disabled={!selectedImage || processImageMutation.isLoading}
        >
          {processImageMutation.isLoading ? "Processing..." : "Remove Mosaic"}
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Original Image</h2>
          {selectedImage && <img src={selectedImage} alt="Original" className="rounded-lg" />}
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Processed Image</h2>
          {processImageMutation.isLoading && <p>Loading...</p>}
          {processedImage && <img src={processedImage} alt="Processed" className="rounded-lg" />}
        </div>
      </div>
    </main>
  );
}
