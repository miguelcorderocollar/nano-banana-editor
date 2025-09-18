interface ProcessImageResponse {
  success: boolean;
  message: string;
  originalImageSize: number;
  instructions: string;
  responseText: string | null;
  generatedImage: string | null;
  error?: string;
}

export class ImageService {
  static async processImage(file: File, instructions: string): Promise<ProcessImageResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('instructions', instructions);

    const response = await fetch('/api/process-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to process image');
    }

    return result;
  }
}
