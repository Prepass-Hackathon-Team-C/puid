import React from "react";
import { Copy, Check, Info } from "lucide-react";

interface ReviewPageProps {
  puid: string;
  prefixCode: string;
  copied: boolean;
  onPrefixChange: (value: string) => void;
  onGeneratePUID: () => void;
  onCopyPUID: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  puid,
  prefixCode,
  copied,
  onPrefixChange,
  onGeneratePUID,
  onCopyPUID,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">
        Password Generator
      </h2>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <div className="mb-4">
          <label
            htmlFor="prefixCode"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
          >
            Enter your prefix code
            <div className="relative group">
              <Info
                size={14}
                className="text-gray-400 hover:text-gray-600 cursor-help"
              />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Uniquely identifies this password
                <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
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

        {puid && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
