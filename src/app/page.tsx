"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile || !instructions.trim()) {
      setSubmitMessage("Please provide both an image and instructions.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('instructions', instructions.trim());

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(`Success! Image processed (${result.imageSize} bytes)`);
      } else {
        setSubmitMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Error: Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Image Upload
          </h1>
          <p className="text-gray-600">
            {selectedImage ? "Edit your thumbnail with instructions below" : "Select a thumbnail image from your computer"}
          </p>
        </div>

        <div className="space-y-8">
          {!selectedImage && (
            <div className="flex items-center justify-center">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}

          {selectedImage && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    src={selectedImage}
                    alt="Uploaded thumbnail"
                    width={900}
                    height={900}
                    className="rounded-lg shadow-lg object-cover"
                    style={{ width: 'auto', height: 'auto', maxWidth: '900px', maxHeight: '900px' }}
                  />
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Edit Instructions
                  </label>
                  <input
                    type="text"
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Describe how you want to edit this thumbnail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                
                {submitMessage && (
                  <div className={`p-3 rounded-lg text-sm ${submitMessage.startsWith('Success') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || !instructions.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
