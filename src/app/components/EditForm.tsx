"use client";
import { Dispatch, SetStateAction } from "react";

interface EditFormProps {
  instructions: string;
  setInstructions: Dispatch<SetStateAction<string>>;
  submitMessage: string;
  isSubmitting: boolean;
  debugMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
}

export default function EditForm({ instructions, setInstructions, submitMessage, isSubmitting, debugMode, onSubmit, submitButtonText }: EditFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl mx-auto">
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
          disabled={isSubmitting || (!instructions.trim() && !debugMode)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
{submitButtonText}
        </button>
      </div>
    </form>
  );
}


