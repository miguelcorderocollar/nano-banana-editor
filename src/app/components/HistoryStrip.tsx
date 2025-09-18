"use client";
import { ImageHistoryItem } from "@/types";

interface HistoryStripProps {
  imageHistory: ImageHistoryItem[];
  onRevert: (item: ImageHistoryItem, index: number) => void;
}

export default function HistoryStrip({ imageHistory, onRevert }: HistoryStripProps) {
  if (imageHistory.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Image History</h3>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {imageHistory.map((item, index) => (
            <div key={item.timestamp} className="flex-shrink-0">
              <div 
                className="w-20 h-20 relative group cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-lg transition-all"
                onClick={() => onRevert(item, index)}
                title={`Click to revert to: "${item.prompt}"`}
              >
                <img
                  src={item.image}
                  alt={`History ${index + 1}`}
                  className="w-full h-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-black group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-medium">
                    #{index + 1}
                  </span>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500 text-center max-w-20 truncate">
                {item.prompt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


