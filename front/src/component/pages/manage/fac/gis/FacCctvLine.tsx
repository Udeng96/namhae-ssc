import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';
import { DataMarker } from '@/component/lib/DataMarker';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
// 신 refac store
import { useGisStore } from '@/component/stores/gisStore';
import { useFacStore } from '@/component/stores/facStore';
import { CctvType } from '@/component/types/common';

/**
 * 시설 GIS CCTV 연결선
 * - 구 cctvLine.tsx(이벤트용)를 시설 전용으로 리팩
 * - 신 facStore.selectFac / 신 gisStore.facScCctvs 사용 (구 store 의존 제거)
 */
const FacCctvLine = () => {
  const map = useMap();

  const facScCctvs = useGisStore((s) => s.facScCctvs);
  const selectFac  = useFacStore((s) => s.selectFac);

  const Left = ['-60px', '-60px', '24px', '24px'];
  const Top  = ['-60px', '-4px', '-60px', '-4px'];
  const line = [
    EVENT_IMAGE.GIS.LINE.FIRST,
    EVENT_IMAGE.GIS.LINE.SECOND,
    EVENT_IMAGE.GIS.LINE.THIRD,
    EVENT_IMAGE.GIS.LINE.FOURTH,
  ];

  useEffect(() => {
    map.eachLayer((l) => {
      if (l.options.pane === 'cctvLines') map.removeLayer(l);
    });

    if (selectFac && facScCctvs.length > 0) {
      facScCctvs.forEach((item, index) => {
        map.addLayer(makeMarker(item, index).getLeafletMarker());
      });
    }
  }, [facScCctvs, selectFac]);

  const renderIcon = (index: number) =>
    L.divIcon({
      className: `cctv-line-${index}`,
      html: ReactDOMServer.renderToString(
        <StyledLine $top={Top[index]} $left={Left[index]} $backImg={line[index]} />,
      ),
      iconAnchor: [20, 20],
    });

  const makeMarker = (cctvInfo: CctvType, index: number) =>
    new DataMarker(
      [Number(selectFac!.ycrdnt), Number(selectFac!.xcrdnt)],
      { pane: 'cctvLines', data: cctvInfo, icon: renderIcon(index) },
    );

  return null;
};

export default FacCctvLine;

const StyledLine = styled.div<{ $backImg: string; $left: string; $top: string }>`
  position: absolute;
  width: 84px;
  height: 44px;
  background: url(${({ $backImg }) => $backImg}) no-repeat center / 100%;
  left: ${({ $left }) => $left};
  top: ${({ $top }) => $top};
  z-index: 20;
`;
