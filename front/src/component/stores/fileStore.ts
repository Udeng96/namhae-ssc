import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ScheFileType } from '../types/sche';
import { FILE_TOAST_TYPE } from '../constants/scheConst';

// ─── 상태 ─────────────────────────────────────────────
interface FileState {
  requestState: string;
  fileToast: string;

  contentsFiles: ScheFileType[];
  noticeFiles: ScheFileType[];

  selectFile: File | null;
  deleteFile: ScheFileType | null;
}

// ─── 액션 ─────────────────────────────────────────────
interface FileActions {
  setRequestState: (requestState: string) => void;
  setFileToast: (fileToast: string) => void;
  setContentsFiles: (contentsFiles: ScheFileType[]) => void;
  setNoticeFiles: (noticeFiles: ScheFileType[]) => void;
  setSelectFile: (selectFile: File | null) => void;
  setDeleteFile: (deleteFile: ScheFileType | null) => void;
}

// ─── 스토어 ───────────────────────────────────────────
export const useFileStore = create<FileState & { actions: FileActions }>()(
  immer((set) => ({
    requestState: 'all',
    fileToast: FILE_TOAST_TYPE.NONE,

    contentsFiles: [],
    noticeFiles: [],

    selectFile: null,
    deleteFile: null,

    actions: {
      setRequestState: (requestState) =>
        set((s) => { s.requestState = requestState; }),

      setFileToast: (fileToast) =>
        set((s) => { s.fileToast = fileToast; }),

      setContentsFiles: (contentsFiles) =>
        set((s) => { s.contentsFiles = contentsFiles; }),

      setNoticeFiles: (noticeFiles) =>
        set((s) => { s.noticeFiles = noticeFiles; }),

      setSelectFile: (selectFile) =>
        set((s) => { s.selectFile = selectFile; }),

      setDeleteFile: (deleteFile) =>
        set((s) => { s.deleteFile = deleteFile; }),
    },
  })),
);
