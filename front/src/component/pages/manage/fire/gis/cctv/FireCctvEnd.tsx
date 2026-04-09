import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useHomeStore } from '@/component/stores/homeStore';
import { useFireStore } from '@/component/stores/fireStore';
import { useFireGisStore } from '@/component/stores/fireGisStore';

/** CCTV 종료 버튼 — 클릭 시 selectEvent/CCTV 목록 초기화 */
const FireCctvEnd = () => {
  const scFacs = useHomeStore((state) => state.scFacs);

  const { selectEvent, setSelectEvent, isBoxOpen } = useFireStore(
    useShallow((state) => ({
      selectEvent:    state.selectEvent,
      setSelectEvent: state.actions.setSelectEvent,
      isBoxOpen:      state.isBoxOpen,
    })),
  );

  const { setEventScCctvs, setEventRadiusCctvs } = useFireGisStore(
    useShallow((state) => ({
      setEventScCctvs:     state.actions.setEventScCctvs,
      setEventRadiusCctvs: state.actions.setEventRadiusCctvs,
    })),
  );

  const [left, setLeft]   = useState<string>('50%');
  const [scNm, setScNm]   = useState<string>('-');

  // 이벤트 박스 열림 여부에 따라 버튼 위치 조정
  useEffect(() => {
    setLeft(isBoxOpen ? '66%' : '50%');
  }, [isBoxOpen]);

  // 선택 이벤트 변경 시 경로당명 추출
  useEffect(() => {
    if (selectEvent) {
      if (selectEvent.outbPlac.includes('_')) {
        const matched = scFacs.find((f) => f.mgtNo === selectEvent.outbPlac);
        setScNm(matched?.facNm ?? '-');
      } else {
        setScNm(selectEvent.outbPlac);
      }
    } else {
      setScNm('-');
    }
  }, [selectEvent, scFacs]);

  const handleBtn = () => {
    if (selectEvent) {
      setEventScCctvs([]);
      setEventRadiusCctvs([]);
      setSelectEvent(null);
    }
  };

  return (
    <StyledButton $isShow={selectEvent !== null} $left={left} onClick={handleBtn}>
      <span>{scNm}</span>
    </StyledButton>
  );
};

export default FireCctvEnd;

const StyledButton = styled.button<{ $isShow: boolean; $left: string }>`
  display: ${({ $isShow }) => ($isShow ? 'flex' : 'none')};
  align-items: center;
  position: absolute;
  top: 30px;
  left: ${({ $left }) => $left};
  transform: translateX(-50%);
  padding: 15px 22px 15px 28px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  border-radius: 999px;
  border: 3px solid #9a69ff;
  background: #1a203a;
  z-index: 10;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  &:after {
    content: '';
    display: block;
    width: 22px;
    height: 22px;
    margin-left: 4px;
    background: url('${GIS_IMAGE.END}') no-repeat center / 100%;
  }

  &:hover {
    background: #2b2171;
  }

  span {
    padding-right: 8px;
    color: #d4d6df;
  }
`;
