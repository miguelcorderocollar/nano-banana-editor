"use client";
import { Dispatch, SetStateAction } from "react";

interface DebugToggleProps {
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
  isSubmitting: boolean;
}

export default function DebugToggle({ debugMode, setDebugMode, isSubmitting }: DebugToggleProps) {
  return (
    <div className="flex items-center justify-end">
      <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={debugMode}
          onChange={(e) => setDebugMode(e.target.checked)}
          disabled={isSubmitting}
        />
        <span className="text-sm text-gray-700">Debug mode (skip API)</span>
      </label>
    </div>
  );
}


