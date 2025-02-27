// Define step types
export type Step = "questions" | "review";

// Define security question type
export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

// Define profile type
export interface Profile {
  questions: SecurityQuestion[];
  usedPrefixCodes: string[];
}

// File System Access API types
interface FileSystemSaveOptions {
  suggestedName?: string;
  types?: {
    description: string;
    accept: Record<string, string[]>;
  }[];
}

interface FileSystemHandle {
  kind: 'file' | 'directory';
}

interface FileSystemFileHandle extends FileSystemHandle {
  kind: 'file';
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: any): Promise<void>;
  close(): Promise<void>;
}

declare global {
  interface Window {
    showSaveFilePicker(options?: FileSystemSaveOptions): Promise<FileSystemFileHandle>;
  }
} 