"use client";
import NextImage from "next/image";

interface ImageViewerProps {
  imageSrc: string;
}

export default function ImageViewer({ imageSrc }: ImageViewerProps) {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <NextImage
          src={imageSrc}
          alt="Uploaded thumbnail"
          width={900}
          height={900}
          className="rounded-lg shadow-lg object-cover"
          style={{ width: 'auto', height: 'auto', maxWidth: '900px', maxHeight: '900px' }}
        />
      </div>
    </div>
  );
}


