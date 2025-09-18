"use client";

export const dataURLtoFile = async (dataurl: string, filename: string): Promise<File> => {
  const response = await fetch(dataurl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

// Draw a bright yellow iteration number on the bottom-right corner of the image
export const overlayIterationNumberOnImage = async (imageDataUrl: string, iteration: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Determine font size relative to image size
        const fontSize = Math.max(24, Math.floor(canvas.width * 0.1));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textBaseline = 'bottom';

        const text = String(iteration);
        const padding = Math.max(10, Math.floor(canvas.width * 0.02));

        // Measure text width/height
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize; // rough approximation

        const x = canvas.width - padding - textWidth;
        const y = canvas.height - padding;

        // Optional dark translucent background for readability
        const bgPaddingX = Math.floor(padding * 0.6);
        const bgPaddingY = Math.floor(padding * 0.4);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(x - bgPaddingX, y - textHeight - bgPaddingY, textWidth + bgPaddingX * 2, textHeight + bgPaddingY * 2);

        // Stroke for contrast
        ctx.lineWidth = Math.max(2, Math.floor(fontSize * 0.08));
        ctx.strokeStyle = 'black';
        ctx.strokeText(text, x, y);

        // Bright yellow fill
        ctx.fillStyle = '#ffff00';
        ctx.fillText(text, x, y);

        const resultUrl = canvas.toDataURL('image/png');
        resolve(resultUrl);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load base image for canvas'));
    img.src = imageDataUrl;
  });
};


