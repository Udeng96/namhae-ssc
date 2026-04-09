// ─── 파일 ─────────────────────────────────────────────
export interface ScheFileType {
  fileId: string;
  fileNm: string;
  fileType: string;
  uploadDtm: string;
  fileDuration: string;
  normalYn: string;
  width: string;
  height: string;
}

export interface FileParam {
  contentType: string;
  duration: string;
  width: string;
  height: string;
}

// ─── 스케줄 ───────────────────────────────────────────
export interface ScheItem {
  contentId: string;
  contentTitle: string;
  startDtm: string;
  endDtm: string;
  repeatDate: string;
  contentArea: string;
  contentFile: string;
  contentType: string;
  contentCntn: string;
  backImage: string;
  expireTime: string;
  colorType: string;
  startTime: string;
  endTime: string;
  contentGrpId: string;
  outbDtm: string;
  expireDtm: string;
  editorType: string;
}

// ─── 캘린더 ───────────────────────────────────────────
export interface CalEventItem {
  title: string;
  className: string;
  start: string;
  end: string;
  id: string;
}

// ─── 경로당 트리 노드 ──────────────────────────────────
export interface ScheLastNode {
  value: string;
  label: string;
  checked?: boolean;
}

export interface ScheParentNode {
  value: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  children: ScheLastNode[];
}

export interface ScheRootNode {
  value: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  children: ScheParentNode[];
}
