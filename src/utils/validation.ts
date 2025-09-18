import { MESSAGES } from '@/constants/messages';

export const validateFormSubmission = (file: File | null, instructions: string, debugMode: boolean): string | null => {
  if (!file) {
    return debugMode ? MESSAGES.ERROR_NO_IMAGE : MESSAGES.ERROR_NO_INSTRUCTIONS;
  }

  if (!instructions.trim() && !debugMode) {
    return MESSAGES.ERROR_NO_INSTRUCTIONS;
  }

  return null; // No validation errors
};
