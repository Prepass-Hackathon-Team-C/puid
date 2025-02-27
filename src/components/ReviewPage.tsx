import React, { useState } from "react";
import { Copy, Check, Info } from "lucide-react";

interface ReviewPageProps {
  puid: string;
  prefixCode: string;
  prefixError: string | null;
  copied: boolean;
  onPrefixChange: (value: string) => void;
  onGeneratePUID: () => void;
  onCopyPUID: () => void;
  minLength: number;
  onMinLengthChange: (value: number) => void;
  onAcceptPUID: () => void;
  onStartOver: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  puid,
  prefixCode,
  prefixError,
  copied,
  onPrefixChange,
  onGeneratePUID,
  onCopyPUID,
  minLength,
  onMinLengthChange,
  onAcceptPUID,
  onStartOver,
}) => {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);
    onAcceptPUID();
  };

  if (isAccepted) {
    return (
      <div className="space-y-8">
        <button
          onClick={() => {
            setIsAccepted(false);
            onStartOver();
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          Create New Password
        </button>
        <div className="space-y-1">
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-white border-2 border-green-500 rounded-lg px-4 py-3">
              <div className="font-mono text-lg break-all">{puid}</div>
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
            <div className="text-sm text-green-600 flex items-center pl-1">
              <Check size={16} className="mr-1" />
              PUID copied to clipboard!
            </div>
          )}
        </div>
      </div>
    );
  }

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
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                id="prefixCode"
                value={prefixCode}
                onChange={(e) => onPrefixChange(e.target.value)}
                maxLength={5}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  prefixError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter prefix code"
                required
              />
              {prefixError && (
                <p className="mt-1 text-sm text-red-600">{prefixError}</p>
              )}
            </div>
            <button
              onClick={onGeneratePUID}
              disabled={
                !prefixCode || prefixCode.length > 5 || prefixError !== null
              }
              className={`px-4 py-2 rounded-md text-white ${
                !prefixCode || prefixCode.length > 5 || prefixError !== null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {puid ? "Regenerate" : "Generate"}
            </button>
          </div>
        </div>

        {puid && (
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-white border border-indigo-300 rounded-lg px-4 py-3 font-mono text-lg break-all">
              {puid}
            </div>
            <div className="flex gap-2">
              <div className="relative group">
                <button
                  onClick={handleAccept}
                  className="text-indigo-600 hover:text-indigo-800 p-2"
                  aria-label="Accept PUID"
                >
                  <Check size={18} />
                </button>
                <div className="absolute right-0 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Accept the password
                  <div className="absolute right-4 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label
            htmlFor="minLength"
            className="flex justify-between items-center text-sm mb-1"
          >
            <div className="font-medium text-gray-700 flex items-center gap-1">
              Minimum Length
              <div className="relative group">
                <Info
                  size={14}
                  className="text-gray-400 hover:text-gray-600 cursor-help"
                />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  The minimum length of the password
                  <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            <span className="text-gray-600">{minLength} characters</span>
          </label>
          <div className="space-y-2">
            <input
              type="range"
              id="minLength"
              value={minLength}
              onChange={(e) => {
                const value = Number(e.target.value);
                const clampedValue = Math.min(Math.max(value, 6), 32);
                onMinLengthChange(clampedValue);
              }}
              min={6}
              max={32}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>6</span>
              <span>32</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
