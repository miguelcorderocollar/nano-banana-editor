export const MESSAGES = {
  // Success messages
  SUCCESS_NANO_BANANA: 'Success! Image processed by Nano Banana',
  SUCCESS_DEBUG_MODE: 'Success! Debug mode generated image',
  SUCCESS_REVERT: (index: number, prompt: string) => `Reverted to image #${index + 1} - "${prompt}"`,

  // Error messages
  ERROR_NO_IMAGE: 'Please provide an image',
  ERROR_NO_INSTRUCTIONS: 'Please provide an image and instructions.',
  ERROR_NO_INSTRUCTIONS_DEBUG: 'Please provide an image.',
  ERROR_API_FAILED: 'Error: Failed to submit form',
  ERROR_REVERT_FAILED: (index: number) => `Error reverting to image #${index + 1}`,
  ERROR_NO_BASE_IMAGE: 'No base image available for debug processing',

  // Info messages
  DEBUG_API_SKIPPED: 'Debug mode: API call skipped.',
  PROCESSING_NANO_BANANA: 'Processing with Nano Banana...',
  PROCESSING_DEBUG: 'Processing (Debug)...',
  PROCESS_AI: 'Process with AI',
  PROCESS_DEBUG: 'Process (Debug)',
} as const;
