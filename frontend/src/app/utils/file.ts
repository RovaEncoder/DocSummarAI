export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
export const MAX_TEXT_LENGTH = 10000000; // 10 million characters

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File ${file.name} is too large. Maximum file size is 2GB.`
    };
  }
  return { isValid: true };
}

export async function validateFileContent(file: File): Promise<FileValidationResult> {
  const text = await file.text();
  if (text.length > MAX_TEXT_LENGTH) {
    return {
      isValid: false,
      error: `File ${file.name} content is too long. Maximum allowed length is 10 million characters.`
    };
  }
  return { isValid: true };
}

export function getFileSize(size: number): string {
  const kb = size / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  }
  return `${(mb / 1024).toFixed(2)} GB`;
}