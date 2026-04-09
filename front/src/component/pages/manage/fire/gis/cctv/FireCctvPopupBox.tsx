import styled from 'styled-components';
import {
  CommonPlayerBox,
  CommonPlayerBtn,
  CommonPlayerIndex,
  CommonPlayerNm,
} from '@/component/lib/css';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { CctvType } from '@/component/types/common';
import CctvPlayer from '@/component/pages/manage/_gis/cctv/CctvPlayer';
import { useGisStore } from '@/component/stores/gisStore';
import { useShallow } from 'zustand/react/shallow';

const CCTV_INDEX = ['A', 'B', 'C', 'D'];

/**
 * 소방 GIS SC CCTV 팝업 박스
 * - 구 fireCctvPopupBox.tsx의 refac 버전
 * - setFullCctv는 구 fireGisStore 대신 전역 gisStore 사용
 */
const FireCctvPopupBox = (props: { index: number; cctvInfo: CctvType | null }) => {
  const { setFullCctv } = useGisStore(
    useShallow((state) => ({
      setFullCctv: state.actions.setFullCctv,
    })),
  );

  const handleExpandBtn = () => {
    setFullCctv(props.cctvInfo);
  };

  return (
    <StyledCctvPlayerBox
      $isShow={props.cctvInfo !== null}
      $isBell={props.index === 2}
    >
      <StyledCctvPlayerIndex>{CCTV_INDEX[props.index]}</StyledCctvPlayerIndex>
      <CctvPlayer cctvInfo={props.cctvInfo} />
      <StyledCctvPlayerNm>
        <p>{props.cctvInfo ? props.cctvInfo.cctvNm : ''}</p>
        <div>
          <StyledCctvPlayerBtn onClick={handleExpandBtn} />
        </div>
      </StyledCctvPlayerNm>
    </StyledCctvPlayerBox>
  );
};

export default FireCctvPopupBox;

const StyledCctvPlayerBox = styled.div<{ $isShow: boolean; $isBell: boolean }>`
  ${CommonPlayerBox};
  display: ${({ $isShow }) => ($isShow ? 'flex' : 'none')};
  width:  ${({ $isBell }) => ($isBell ? '528px' : '384px')};
  height: ${({ $isBell }) => ($isBell ? '297px' : '216px')};
`;

const StyledCctvPlayerIndex = styled.div`
  ${CommonPlayerIndex};
`;

const StyledCctvPlayerNm = styled.div`
  ${CommonPlayerNm};

  div {
    display: flex;
  }

  button {
    width: 20px;
    height: 20px;
    cursor: pointer;
    background: url('${EVENT_IMAGE.GIS.BTN.PLAYER.EXPANSION.NORM}') no-repeat center / 100%;

    &:hover {
      background: url('${EVENT_IMAGE.GIS.BTN.PLAYER.EXPANSION.HOVER}') no-repeat center / 100%;
    }
  }
`;

const StyledCctvPlayerBtn = styled.div`
  ${CommonPlayerBtn};
  background: url('${EVENT_IMAGE.GIS.BTN.PLAYER.EXPANSION.NORM}') no-repeat center / 100%;

  &:hover {
    background: url('${EVENT_IMAGE.GIS.BTN.PLAYER.EXPANSION.HOVER}') no-repeat center / 100%;
  }
`;
