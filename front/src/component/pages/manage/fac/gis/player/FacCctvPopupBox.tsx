import styled from 'styled-components';
import {
  CommonPlayerBtn,
  CommonPlayerFacBox,
  CommonPlayerIndex,
  CommonPlayerNm,
} from '@/component/lib/css';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { CctvType } from '@/component/types/common';
import FacCctvPlayer from '@/component/pages/manage/_gis/cctv/FacCctvPlayer';
import { useGisStore } from '@/component/stores/gisStore';

const CCTV_INDEX = ['A', 'B', 'C', 'D'];

const FacCctvPopupBox = (props: { index: number; cctvInfo: CctvType | null }) => {
  const setFullCctv = useGisStore().actions.setFullCctv;

  const handleExpandBtn = () => {
    setFullCctv(props.cctvInfo);
  };

  return (
    <StyledCctvPlayerBox $isShow={props.cctvInfo !== null}>
      <StyledCctvPlayerIndex>{CCTV_INDEX[props.index]}</StyledCctvPlayerIndex>
      <FacCctvPlayer cctvInfo={props.cctvInfo} />
      <StyledCctvPlayerNm>
        <p>{props.cctvInfo ? props.cctvInfo.cctvNm : ''}</p>
        <StyledCctvPlayerBtn onClick={handleExpandBtn} />
      </StyledCctvPlayerNm>
    </StyledCctvPlayerBox>
  );
};

export default FacCctvPopupBox;

const StyledCctvPlayerBox = styled.div<{ $isShow: boolean }>`
  ${CommonPlayerFacBox};
  display: ${({ $isShow }) => ($isShow ? 'flex' : 'none')};
`;

const StyledCctvPlayerIndex = styled.div`
  ${CommonPlayerIndex};
`;

const StyledCctvPlayerNm = styled.div`
  ${CommonPlayerNm};
`;

const StyledCctvPlayerBtn = styled.div`
  ${CommonPlayerBtn};
  background: url('${EVENT_IMAGE.GIS.BTN.PLAYER.EXPANSION.NORM}') no-repeat center / 100%;

  &:hover {
    background: url('${EVENT_IMAGE.GIS.BTN.PLAYER.EXPANSION.HOVER}') no-repeat center / 100%;
  }
`;
