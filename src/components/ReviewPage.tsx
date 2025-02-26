import React from "react";
import { Copy, Check } from "lucide-react";

interface ReviewPageProps {
  puid: string;
  prefixCode: string;
  copied: boolean;
  onPrefixChange: (value: string) => void;
  onGeneratePUID: () => void;
  onCopyPUID: () => void;
  onDownloadProfile: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  puid,
  prefixCode,
  copied,
  onPrefixChange,
  onGeneratePUID,
  onCopyPUID,
  onDownloadProfile,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Personal Identity
        </h2>
        <p className="text-gray-600">
          Based on your answers, we've generated your unique Personal User
          Identifier (PUID).
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-indigo-800 mb-4">
            Your PUID
          </h3>

          <label
            htmlFor="prefixCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter your prefix code (1-5 characters)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="prefixCode"
              value={prefixCode}
              onChange={(e) => onPrefixChange(e.target.value)}
              maxLength={5}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter prefix code"
              required
            />
            <button
              onClick={onGeneratePUID}
              disabled={!prefixCode || prefixCode.length > 5}
              className={`px-4 py-2 rounded-md text-white ${
                !prefixCode || prefixCode.length > 5
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {puid ? "Regenerate" : "Generate"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex-1 bg-white border border-indigo-300 rounded-lg px-4 py-3 font-mono text-lg break-all">
            {puid}
          </div>
          <button
            onClick={onCopyPUID}
            className="text-indigo-600 hover:text-indigo-800 p-2"
            aria-label="Copy PUID"
          >
            <Copy size={18} />
          </button>
        </div>

        {copied && (
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <Check size={16} className="mr-1" />
            PUID copied to clipboard!
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onDownloadProfile}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Download PUID Profile
        </button>
      </div>
    </div>
  );
};
