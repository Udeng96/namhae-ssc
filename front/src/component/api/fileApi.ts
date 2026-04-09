import { apiClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import { ScheFileType } from '../types/sche';

// ─── 파일 ─────────────────────────────────────────────
export const fetchAllFiles = (): ApiResponse<ScheFileType[]> =>
  apiClient.get(API.FILE.LIST);

export const uploadFile = (formData: FormData): ApiResponse<unknown> =>
  apiClient.post(API.FILE.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteFile = (fileId: string): ApiResponse<unknown> =>
  apiClient.delete(API.FILE.DELETE(fileId));
