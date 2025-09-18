"use client";

import { useState } from "react";
import { ImageHistoryItem } from "@/types";
import { dataURLtoFile, overlayIterationNumberOnImage } from "@/lib/imageUtils";
import { ImageService } from "@/services/imageService";
import { validateFormSubmission } from "@/utils/validation";
import { MESSAGES } from "@/constants/messages";

export const useImageEditor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const revertToHistoryImage = async (historyItem: ImageHistoryItem, index: number) => {
    try {
      // Truncate history to the selected point (pop everything after this index)
      setImageHistory(prev => prev.slice(0, index));

      // Set the selected history image as current
      setSelectedImage(historyItem.image);
      const newFile = await dataURLtoFile(historyItem.image, `reverted_${Date.now()}.png`);
      setSelectedFile(newFile);

      // Clear any messages and set instructions hint
      setSubmitMessage(MESSAGES.SUCCESS_REVERT(index, historyItem.prompt));
      setInstructions("");
      setResponseText(null);

    } catch (error) {
      console.error('Error reverting to history image:', error);
      setSubmitMessage(MESSAGES.ERROR_REVERT_FAILED(index));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateFormSubmission(selectedFile, instructions, debugMode);
    if (validationError) {
      setSubmitMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      if (debugMode) {
        await processDebugMode();
      } else {
        await processWithAPI();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage(MESSAGES.ERROR_API_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const processDebugMode = async () => {
    const iterationNumber = imageHistory.length + 1;
    const baseImage = selectedImage;

    if (!baseImage) {
      throw new Error(MESSAGES.ERROR_NO_BASE_IMAGE);
    }

    // Add current image to history before replacing it
    const historyItem: ImageHistoryItem = {
      image: baseImage,
      prompt: instructions.trim(),
      timestamp: Date.now()
    };
    setImageHistory(prev => [...prev, historyItem]);

    const generatedImage = await overlayIterationNumberOnImage(baseImage, iterationNumber);
    setSelectedImage(generatedImage);

    try {
      const newFile = await dataURLtoFile(generatedImage, `edited_${Date.now()}.png`);
      setSelectedFile(newFile);
    } catch (error) {
      console.error('Error converting generated image to file:', error);
    }

    setSubmitMessage(`${MESSAGES.SUCCESS_DEBUG_MODE} #${iterationNumber}`);
    setResponseText(MESSAGES.DEBUG_API_SKIPPED);
    setInstructions("");
  };

  const processWithAPI = async () => {
    if (!selectedFile) return;

    const result = await ImageService.processImage(selectedFile, instructions.trim());

    setSubmitMessage(`${MESSAGES.SUCCESS_NANO_BANANA} (${result.originalImageSize} bytes)`);
    setResponseText(result.responseText);

    if (result.generatedImage && selectedImage) {
      // Add current image to history before replacing it
      const historyItem: ImageHistoryItem = {
        image: selectedImage,
        prompt: instructions.trim(),
        timestamp: Date.now()
      };
      setImageHistory(prev => [...prev, historyItem]);

      // Replace current image with generated result
      setSelectedImage(result.generatedImage);

      // Convert the generated image back to a File for future processing
      try {
        const newFile = await dataURLtoFile(result.generatedImage, `edited_${Date.now()}.png`);
        setSelectedFile(newFile);
      } catch (error) {
        console.error('Error converting generated image to file:', error);
      }

      // Clear instructions for next iteration
      setInstructions("");
    }
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return debugMode ? MESSAGES.PROCESSING_DEBUG : MESSAGES.PROCESSING_NANO_BANANA;
    }
    return debugMode ? MESSAGES.PROCESS_DEBUG : MESSAGES.PROCESS_AI;
  };

  return {
    // State
    selectedImage,
    selectedFile,
    instructions,
    setInstructions,
    isSubmitting,
    submitMessage,
    imageHistory,
    responseText,
    debugMode,
    setDebugMode,

    // Handlers
    handleImageUpload,
    handleSubmit,
    revertToHistoryImage,

    // Computed values
    getSubmitButtonText,
  };
};
