import { LatLngTuple } from 'leaflet';

export const MAP_TILE_TYPE = {
  NORMAL:    'NORMAL',
  SATELLITE: 'SATELLITE',
  HYBRID:    'HYBRID',
} as const;
export type MapTileType = typeof MAP_TILE_TYPE[keyof typeof MAP_TILE_TYPE];

export const GIS_RANGE_TYPE = {
  SMALL: '500m',
  LARGE: '1km',
} as const;
export type GisRangeType = typeof GIS_RANGE_TYPE[keyof typeof GIS_RANGE_TYPE];

export const DRAW_GIS_TYPE = {
  NONE:     'NONE',
  DISTANCE: 'DISTANCE',
  EXTENT:   'EXTENT',
  CIRCLE:   'CIRCLE',
} as const;
export type DrawGisType = typeof DRAW_GIS_TYPE[keyof typeof DRAW_GIS_TYPE];

// ─── 기본 좌표 (남해) ─────────────────────────────────
export const DEFAULT_LAT_LNG: LatLngTuple = [34.8368, 127.892649];

// ─── Vworld 타일 지도 URL ────────────────────────────
// 운영 서버는 내부 리버스 프록시가 `:8080/xdworld.vworld.kr:8080` 경로로
// Vworld 업스트림을 중계한다. 포트·경로 suffix 모두 필수.
// 예) host = '127.0.0.1'  →  http://127.0.0.1:8080/xdworld.vworld.kr:8080/2d/...
const _host = window.location.hostname; // 포트 제외 (hostname)
const VWORLD_DOMAIN     = `http://${_host}:8080/xdworld.vworld.kr:8080`;
const VWORLD_DOMAIN_DEV = `https://xdworld.vworld.kr`;

export const TILE_MAP_VWORLD: { [key: string]: { name: string; url: string } } = {
  NORMAL:        { name: '일반지도',                        url: `${VWORLD_DOMAIN}/2d/Base/service/{z}/{x}/{y}.png` },
  SATELLITE:     { name: '위성지도',                        url: `${VWORLD_DOMAIN}/2d/Satellite/service/{z}/{x}/{y}.jpeg` },
  HYBRID:        { name: '하이브리드(위성지도와 함께 사용)', url: `${VWORLD_DOMAIN}/2d/Hybrid/service/{z}/{x}/{y}.png` },
  NORMAL_DEV:    { name: '일반지도',                        url: `${VWORLD_DOMAIN_DEV}/2d/Base/service/{z}/{x}/{y}.png` },
  SATELLITE_DEV: { name: '위성지도',                        url: `${VWORLD_DOMAIN_DEV}/2d/Satellite/service/{z}/{x}/{y}.jpeg` },
  HYBRID_DEV:    { name: '하이브리드(위성지도와 함께 사용)', url: `${VWORLD_DOMAIN_DEV}/2d/Hybrid/service/{z}/{x}/{y}.png` },
};
