import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useFacStore } from '@/component/stores/facStore';
import { useGisStore } from '@/component/stores/gisStore';
import { MAP_TILE_TYPE, DRAW_GIS_TYPE } from '@/component/constants/gisConst';

/**
 * 시설 GIS 초기화 버튼
 * - 줌 17 / 위성 타일 / 그리기 해제
 * - 목록 패널 열기 + 첫 번째 시설 선택
 */
const FacResetBtn = () => {
  const { facList, setSelectFac, setListOpen } = useFacStore(
    useShallow((s) => ({
      facList:      s.facList,
      setSelectFac: s.actions.setSelectFac,
      setListOpen:  s.actions.setListOpen,
    })),
  );

  const { setFacZoom, setFacMapType, setFacDrawType } = useGisStore(
    useShallow((s) => ({
      setFacZoom:    s.actions.setFacZoom,
      setFacMapType: s.actions.setFacMapType,
      setFacDrawType: s.actions.setFacDrawType,
    })),
  );

  const handleReset = () => {
    // 신 gisStore 초기화
    // ※ zoom은 selectFac useEffect(FacGisControl)에서 처리하므로 여기서 설정하지 않음.
    //   setFacZoom(17)을 먼저 호출하면 map.getCenter()가 현재 패닝 위치라서
    //   지도가 잘못된 중심으로 이동하는 문제가 생김.
    setFacMapType(MAP_TILE_TYPE.SATELLITE);
    setFacDrawType(DRAW_GIS_TYPE.NONE);

    // 목록 열기
    setListOpen(true);

    // null → value 패턴:
    //   selectFac이 이미 facList[0]이어도 FacGisControl의
    //   useEffect([selectFac])를 강제 실행하여 지도 중심·줌·CCTV를 올바르게 초기화.
    //   setTimeout(0)으로 null useEffect가 먼저 완료된 뒤 value를 세팅함.
    setSelectFac(null);
    setTimeout(() => {
      if (facList.length > 0) setSelectFac(facList[0]);
      else setFacZoom(17);  // 시설 없을 때만 직접 줌 리셋 (중심 재설정 불가)
    }, 0);
  };

  return (
    <StyledResetBtn onClick={handleReset}>
      <i />
      초기화
    </StyledResetBtn>
  );
};

export default FacResetBtn;

const StyledResetBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 98px;
  height: 40px;
  border-radius: 8px;
  background: #12172e;
  border: 1px solid #090a14;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #f2f4fc;

  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    background-size: 100%;
    background-image: url('${GIS_IMAGE.TOP.RESET.BASE}');
  }

  &:hover {
    color: #7a45ff;
    border-color: #543faf;

    i {
      background-image: url('${GIS_IMAGE.TOP.RESET.HOVER}');
    }
  }
`;
