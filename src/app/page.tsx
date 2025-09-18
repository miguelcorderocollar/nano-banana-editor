"use client";

import { useImageEditor } from "@/hooks/useImageEditor";
import DebugToggle from "./components/DebugToggle";
import ImageUploader from "./components/ImageUploader";
import ImageViewer from "./components/ImageViewer";
import EditForm from "./components/EditForm";
import HistoryStrip from "./components/HistoryStrip";

export default function Home() {
  const {
    selectedImage,
    instructions,
    setInstructions,
    isSubmitting,
    submitMessage,
    imageHistory,
    responseText,
    debugMode,
    setDebugMode,
    handleImageUpload,
    handleSubmit,
    revertToHistoryImage,
    getSubmitButtonText,
  } = useImageEditor();


  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 ${imageHistory.length > 0 ? 'pb-32' : ''}`}>
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
          <DebugToggle
            debugMode={debugMode}
            setDebugMode={setDebugMode}
            isSubmitting={isSubmitting}
          />
          {!selectedImage && (
            <ImageUploader onUpload={handleImageUpload} />
          )}

          {selectedImage && (
            <div className="space-y-6">
              <ImageViewer imageSrc={selectedImage} />
              
              <EditForm
                instructions={instructions}
                setInstructions={setInstructions}
                submitMessage={submitMessage}
                isSubmitting={isSubmitting}
                debugMode={debugMode}
                onSubmit={handleSubmit}
                submitButtonText={getSubmitButtonText()}
              />
              
              {responseText && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                  <h4 className="font-medium text-blue-900 mb-2">Latest AI Response:</h4>
                  <p className="text-blue-800">{responseText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <HistoryStrip
        imageHistory={imageHistory}
        onRevert={revertToHistoryImage}
      />
    </div>
  );
}
