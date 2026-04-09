// ─── API Response ─────────────────────────────────────
export interface ScheduleResType {
  videos: ScheduleType[];
  norms:  ScheduleType[];
  emers:  ScheduleType[];
}

export interface ScheduleType {
  contentId:    string;
  contentTitle: string;
  contentCntn:  string;
  contentType:  string;
  contentArea:  string;
  startDtm:     string;
  endDtm:       string;
  expireDtm:    string;
  expireTime:   string;
  fileList:     NotiFileType[];
}

export interface NotiFileType {
  fileId:   string;
  fileNm:   string;
  fileType: string;
  noti:     boolean;
}

// ─── WebSocket ────────────────────────────────────────
export interface SocketScheType {
  postType: string;
  message:  SocketMsgType;
}

export interface SocketMsgType {
  backImage:    string;
  colorType:    string;
  contentArea:  string;
  contentCntn:  string;
  contentFile:  string;
  contentGrpId: string;
  contentId:    string;
  contentTitle: string;
  contentType:  string;
  endDtm:       string;
  endTime:      string;
  expireDtm:    string | null;
  expireTime:   string | null;
  outbDtm:      string;
  repeatDate:   string | null;
  startDtm:     string;
  startTime:    string;
}
