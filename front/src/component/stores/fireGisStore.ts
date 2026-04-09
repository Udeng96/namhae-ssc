import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { LatLngTuple } from 'leaflet';
import { CctvType } from '../types/common';
import {
  MAP_TILE_TYPE,
  GIS_RANGE_TYPE,
  DRAW_GIS_TYPE,
  DrawGisType,
  MapTileType,
  GisRangeType,
} from '../constants/gisConst';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';
import { EventHeatmap } from '../types/event';

interface FireGisState {
  // 지도 기본
  eventMapType:  MapTileType;
  eventZoom:     number;
  eventCenter:   LatLngTuple;
  eventDrawType: DrawGisType;

  // CCTV 반경/시설
  eventRadius:       GisRangeType;
  eventRadiusCctvs:  CctvType[];
  eventScCctvs:      CctvType[];

  // 히트맵
  eventHeatmap:   EventHeatmap[];
  eventHeatmapOn: boolean;
}

interface FireGisActions {
  setEventMapType:      (type: MapTileType)    => void;
  setEventZoom:         (zoom: number)         => void;
  setEventCenter:       (center: LatLngTuple)  => void;
  setEventDrawType:     (type: DrawGisType)    => void;

  setEventRadius:       (radius: GisRangeType) => void;
  setEventRadiusCctvs:  (cctvs: CctvType[])   => void;
  setEventScCctvs:      (cctvs: CctvType[])   => void;

  setEventHeatmap:   (data: EventHeatmap[]) => void;
  setEventHeatmapOn: (v: boolean)           => void;
}

export const useFireGisStore = create<FireGisState & { actions: FireGisActions }>()(
  immer((set) => ({
    eventMapType:  MAP_TILE_TYPE.SATELLITE,
    eventZoom:     15,
    eventCenter:   DEFAULT_LAT_LNG,
    eventDrawType: DRAW_GIS_TYPE.NONE,

    eventRadius:      GIS_RANGE_TYPE.SMALL,
    eventRadiusCctvs: [],
    eventScCctvs:     [],

    eventHeatmap:   [],
    eventHeatmapOn: false,

    actions: {
      setEventMapType:     (type)   => set((s) => { s.eventMapType     = type;   }),
      setEventZoom:        (zoom)   => set((s) => { s.eventZoom        = zoom;   }),
      setEventCenter:      (center) => set((s) => { s.eventCenter      = center; }),
      setEventDrawType:    (type)   => set((s) => { s.eventDrawType    = type;   }),

      setEventRadius:      (radius) => set((s) => { s.eventRadius      = radius; }),
      setEventRadiusCctvs: (cctvs)  => set((s) => { s.eventRadiusCctvs = cctvs; }),
      setEventScCctvs:     (cctvs)  => set((s) => { s.eventScCctvs    = cctvs;  }),

      setEventHeatmap:   (data) => set((s) => { s.eventHeatmap   = data; }),
      setEventHeatmapOn: (v)    => set((s) => { s.eventHeatmapOn = v;    }),
    },
  })),
);
