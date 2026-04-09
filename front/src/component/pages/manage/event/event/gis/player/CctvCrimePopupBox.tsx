import styled from 'styled-components';
import {
  CommonPlayerBtn,
  CommonPlayerCrimeBox,
  CommonPlayerIndex,
  CommonPlayerNm,
} from '@/component/lib/css';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { CctvType } from '@/component/types/common';
import CctvPlayer from '@/component/pages/manage/_gis/cctv/CctvPlayer';
import { useGisStore } from '@/component/stores/gisStore';

const Right = ['260px', '-140px', '-540px'];

const CctvCrimePopupBox = (props: { index: number; cctvInfo: CctvType | null }) => {
  const setFullCctv = useGisStore((s) => s.actions.setFullCctv);

  const handleExpandBtn = () => {
    setFullCctv(props.cctvInfo);
  };

  return (
    <StyledCctvPlayerBox $isShow={props.cctvInfo !== null} $right={Right[props.index]}>
      <StyledCctvPlayerIndex>{props.index + 1}</StyledCctvPlayerIndex>
      <CctvPlayer cctvInfo={props.cctvInfo} />
      <StyledCctvPlayerNm>
        <p>{props.cctvInfo ? props.cctvInfo.cctvNm : ''}</p>
        <StyledCctvPlayerBtn onClick={handleExpandBtn} />
      </StyledCctvPlayerNm>
    </StyledCctvPlayerBox>
  );
};

export default CctvCrimePopupBox;

const StyledCctvPlayerBox = styled.div<{ $isShow: boolean; $right: string }>`
  display: ${({ $isShow }) => ($isShow ? 'flex' : 'none')};
  ${CommonPlayerCrimeBox};
  right: ${({ $right }) => $right};
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
