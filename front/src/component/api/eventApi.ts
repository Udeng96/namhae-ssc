import { apiClient, externalClient, ApiResponse } from '../lib/apiClient';
import { API } from '../lib/urls';
import {
  EventResult,
  EventParam,
  EventHeatmap,
  TodayEventItem,
  PhoneTargetFirst,
  BroadDevice,
  BellConfType,
  ConfType,
  SmsBodyType,
} from '../types/event';

// ─── 이벤트 목록 ──────────────────────────────────────
export const fetchMainEventList = (param: EventParam): ApiResponse<EventResult> =>
  apiClient.get(API.EVENT.LIST, { params: param });

// ─── 지난 이벤트 목록 (동일 엔드포인트, 날짜 범위 + plcId 포함) ──
export const fetchLastEventList = (param: EventParam): ApiResponse<EventResult> =>
  apiClient.get(API.EVENT.LIST, { params: { ...param, plcId: '' } });

export const fetchTodayStatusEventList = (param: {
  mgtNo: string;
  startDtm: string;
  endDtm: string;
}): ApiResponse<TodayEventItem[]> =>
  apiClient.get(API.EVENT.TODAY_STATUS(param.mgtNo), {
    params: { startDtm: param.startDtm, endDtm: param.endDtm },
  });

// ─── 공유 ──────────────────────────────────────────────
export const shareEventToFire = (seqn: string): ApiResponse<string> =>
  apiClient.post(API.EVENT.SHARE, {}, { params: { seqn } });

// ─── SMS / 방송 ────────────────────────────────────────
export const fetchPhoneTargetList = (): ApiResponse<PhoneTargetFirst[]> =>
  apiClient.get(API.EVENT.SMS.TARGET_PHONE);

export const fetchDeviceTargetList = (): ApiResponse<BroadDevice[]> =>
  apiClient.get(API.EVENT.SMS.TARGET_DEVICE);

export const sendMsg = (body: SmsBodyType[]): ApiResponse<{ resultCode: string; resultMessage: string }> =>
  apiClient.post(API.EVENT.SMS.SEND, body);

// ─── 회의 ─────────────────────────────────────────────
export const getEventConf = (seqn: string): ApiResponse<BellConfType[]> =>
  apiClient.get(API.EVENT.CONF.INFO, { params: { seqn } });

export const createEventConf = (param: { scMgtNo: string; seqn: string }): ApiResponse<ConfType> =>
  apiClient.post(API.EVENT.CONF.CREATE(param.scMgtNo), {}, { params: { seqn: param.seqn } });

export const closeEventConf = (seqn: string): ApiResponse<BellConfType> =>
  apiClient.put(API.EVENT.CONF.CLOSE, {}, { params: { seqn } });

export const getLoginToken = (userId: string): ApiResponse<string> =>
  apiClient.get(API.EVENT.CONF.SSO(userId));

// ─── Axis 외부 API (externalClient 사용) ───────────────
export const setBellSpeakMute = (param: { mgtNo: string; status: string }): ApiResponse<boolean> =>
  externalClient.get(API.AXIS.MUTE, {
    params: { 'center-id': param.mgtNo, status: param.status },
  });

export const setFireAlarmOn = (): ApiResponse<string> =>
  externalClient.post(API.AXIS.SIGNAL_ON);

export const setFireAlarmOff = (): ApiResponse<string> =>
  externalClient.post(API.AXIS.SIGNAL_OFF);

// ─── 히트맵 ────────────────────────────────────────────
export const fetchEventHeatmap = (param: {
  startDtm: string;
  endDtm: string;
  statEvetCd: string;
}): ApiResponse<EventHeatmap[]> =>
  apiClient.get(API.EVENT.HEATMAP, { params: param });
