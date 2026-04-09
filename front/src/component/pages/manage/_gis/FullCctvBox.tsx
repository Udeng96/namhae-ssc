import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
  CommonModalWrap,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import FullCctvPlayer from '@/component/pages/manage/_gis/cctv/FullCctvPlayer';
import { useGisStore } from '@/component/stores/gisStore';
import { useHomeStore } from '@/component/stores/homeStore';

const FullCctvBox = () => {
  const { fullCctv, setFullCctv } = useGisStore(
    useShallow((state) => ({
      fullCctv:    state.fullCctv,
      setFullCctv: state.actions.setFullCctv,
    })),
  );

  const scFacs = useHomeStore((state) => state.scFacs);

  const [mgtNo, setMgtNo] = useState<string>('');

  // fullCctv 변경 시 mgtNo 추출
  useEffect(() => {
    if (fullCctv) {
      const scNm = fullCctv.cctvNm.split('_')[0];
      const scInfo = scFacs.find((item) => item.facNm === scNm);
      setMgtNo(scInfo?.mgtNo ?? '');
    } else {
      setMgtNo('');
    }
  }, [scFacs, fullCctv]);

  return (
    <StyledFullPlayer $isOpen={fullCctv !== null}>
      <StyledFullPlayerDimmed />
      <StyledFullPlayerWrap>
        <StyledFullPlayerBox>
          <FullCctvPlayer cctvInfo={fullCctv} />
          <StyledFullPlayerInfo>
            {fullCctv ? fullCctv.cctvNm : ''}
            <div>
              <button onClick={() => setFullCctv(null)} />
            </div>
          </StyledFullPlayerInfo>
        </StyledFullPlayerBox>
      </StyledFullPlayerWrap>
    </StyledFullPlayer>
  );
};

export default FullCctvBox;

const StyledFullPlayer = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;

const StyledFullPlayerDimmed = styled.div`
  ${CommonModalDimmed};
`;

const StyledFullPlayerWrap = styled.div`
  ${CommonModalWrap};
  border-radius: 16px;
`;

const StyledFullPlayerBox = styled.div`
  width: 1600px;
  height: 900px;
  position: relative;
  justify-content: center;
  flex-direction: column;
  border: 2px solid #c01d2a;
  background: white;
  display: flex;
`;

const StyledFullPlayerInfo = styled.div`
  display: inline-flex;
  padding: 6px 10px 6px 20px;
  width: 100%;
  height: 60px;
  position: absolute;
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  bottom: 0;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 59.23%,
    rgba(102, 102, 102, 0) 91.12%
  );

  button {
    width: 48px;
    height: 48px;
    cursor: pointer;
    background: url('${MODAL_IMAGE.CCTV.CONSTRACT.BASE}') no-repeat center / 100%;

    &:hover {
      background: url('${MODAL_IMAGE.CCTV.CONSTRACT.HOVER}') no-repeat center / 100%;
    }
  }
`;
