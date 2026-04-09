import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { LatLngTuple } from 'leaflet';
import { CctvType } from '../types/common';
import { MAP_TILE_TYPE, GIS_RANGE_TYPE, DRAW_GIS_TYPE, DrawGisType, MapTileType, GisRangeType } from '../constants/gisConst';
import { DEFAULT_LAT_LNG } from '@/component/constants/gisConst';

interface GisState {
  // ── Event GIS ─────────────────────────────────────────
  eventMapType:      MapTileType;
  eventZoom:         number;
  eventCenter:       LatLngTuple;
  eventRadius:       GisRangeType;
  eventRadiusCctvs:  CctvType[];
  eventScCctvs:      CctvType[];
  eventDrawType:     DrawGisType;

  // ── Fac GIS ───────────────────────────────────────────
  facMapType:  MapTileType;
  facZoom:     number;
  facCenter:   LatLngTuple;
  facScCctvs:  CctvType[];
  facDrawType: DrawGisType;

  // ── Full CCTV Player ──────────────────────────────────
  fullCctv: CctvType | null;
}

interface GisActions {
  // Event
  setEventMapType:     (type: MapTileType)    => void;
  setEventZoom:        (zoom: number)         => void;
  setEventCenter:      (center: LatLngTuple)  => void;
  setEventRadius:      (radius: GisRangeType) => void;
  setEventRadiusCctvs: (cctvs: CctvType[])   => void;
  setEventScCctvs:     (cctvs: CctvType[])   => void;
  setEventDrawType:    (type: DrawGisType)    => void;

  // Fac
  setFacMapType:  (type: MapTileType)   => void;
  setFacZoom:     (zoom: number)        => void;
  setFacCenter:   (center: LatLngTuple) => void;
  setFacScCctvs:  (cctvs: CctvType[])  => void;
  setFacDrawType: (type: DrawGisType)   => void;

  // Full CCTV Player
  setFullCctv: (cctv: CctvType | null) => void;
}

export const useGisStore = create<GisState & { actions: GisActions }>()(
  immer((set) => ({
    eventMapType:     MAP_TILE_TYPE.SATELLITE,
    eventZoom:        15,
    eventCenter:      DEFAULT_LAT_LNG,
    eventRadius:      GIS_RANGE_TYPE.SMALL,
    eventRadiusCctvs: [],
    eventScCctvs:     [],
    eventDrawType:    DRAW_GIS_TYPE.NONE,

    facMapType:  MAP_TILE_TYPE.SATELLITE,
    facZoom:     17,
    facCenter:   DEFAULT_LAT_LNG,
    facScCctvs:  [],
    facDrawType: DRAW_GIS_TYPE.NONE,

    fullCctv: null,

    actions: {
      setEventMapType:     (type)   => set((s) => { s.eventMapType     = type;   }),
      setEventZoom:        (zoom)   => set((s) => { s.eventZoom        = zoom;   }),
      setEventCenter:      (center) => set((s) => { s.eventCenter      = center; }),
      setEventRadius:      (radius) => set((s) => { s.eventRadius      = radius; }),
      setEventRadiusCctvs: (cctvs)  => set((s) => { s.eventRadiusCctvs = cctvs; }),
      setEventScCctvs:     (cctvs)  => set((s) => { s.eventScCctvs    = cctvs;  }),
      setEventDrawType:    (type)   => set((s) => { s.eventDrawType    = type;   }),

      setFacMapType:  (type)   => set((s) => { s.facMapType  = type;   }),
      setFacZoom:     (zoom)   => set((s) => { s.facZoom     = zoom;   }),
      setFacCenter:   (center) => set((s) => { s.facCenter   = center; }),
      setFacScCctvs:  (cctvs)  => set((s) => { s.facScCctvs = cctvs;  }),
      setFacDrawType: (type)   => set((s) => { s.facDrawType = type;   }),

      setFullCctv: (cctv) => set((s) => { s.fullCctv = cctv; }),
    },
  })),
);
