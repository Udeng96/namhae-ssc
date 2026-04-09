import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GIS_IMAGE } from '@/component/lib/constImage';
import { useCommonStore } from '@/component/stores/commonStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { useFacStore } from '@/component/stores/facStore';
import { useEventStore } from '@/component/stores/eventStore';
import { useGisStore } from '@/component/stores/gisStore';
import { NAV_CODE } from '@/component/constants/nav';

/** CCTV 종료 버튼 — 이벤트/시설 페이지 공용 */
const CctvEnd = () => {
  const selectNav = useCommonStore((state) => state.selectNav);
  const scFacs    = useHomeStore((state) => state.scFacs);

  const { selectFac, setSelectFac, listOpen, stateOpen } = useFacStore(
    useShallow((state) => ({
      selectFac:    state.selectFac,
      setSelectFac: state.actions.setSelectFac,
      listOpen:     state.listOpen,
      stateOpen:    state.stateOpen,
    })),
  );

  const { selectEvent, setSelectEvent, isBoxOpen } = useEventStore(
    useShallow((state) => ({
      selectEvent:    state.selectEvent,
      setSelectEvent: state.actions.setSelectEvent,
      isBoxOpen:      state.isBoxOpen,
    })),
  );

  const { setFacScCctvs, setEventScCctvs, setEventRadiusCctvs } = useGisStore(
    useShallow((state) => ({
      setFacScCctvs:       state.actions.setFacScCctvs,
      setEventScCctvs:     state.actions.setEventScCctvs,
      setEventRadiusCctvs: state.actions.setEventRadiusCctvs,
    })),
  );

  const [left, setLeft] = useState<string>('50%');
  const [scNm, setScNm] = useState<string>('-');

  useEffect(() => {
    if (selectNav.cd === NAV_CODE.FAC) {
      if (listOpen && stateOpen)        setLeft('52%');
      else if (listOpen && !stateOpen)  setLeft('66%');
      else if (!listOpen && stateOpen)  setLeft('39%');
      else                              setLeft('50%');
    } else if (selectNav.cd === NAV_CODE.EVENT) {
      setLeft(isBoxOpen ? '66%' : '50%');
    }
  }, [selectNav, listOpen, stateOpen, isBoxOpen]);

  useEffect(() => {
    if (selectNav.cd === NAV_CODE.FAC) {
      setScNm(selectFac ? selectFac.facNm : '-');
    } else if (selectNav.cd === NAV_CODE.EVENT) {
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
    }
  }, [selectNav, selectEvent, selectFac, scFacs]);

  const handleBtn = () => {
    if (selectNav.cd === NAV_CODE.FAC) {
      if (selectFac) {
        setFacScCctvs([]);
        setSelectFac(null);
      }
    } else if (selectNav.cd === NAV_CODE.EVENT) {
      if (selectEvent) {
        setEventScCctvs([]);
        setEventRadiusCctvs([]);
        setSelectEvent(null);
      }
    }
  };

  const isFacShow   = selectNav.cd === NAV_CODE.FAC   && selectFac   !== null;
  const isEventShow = selectNav.cd === NAV_CODE.EVENT  && selectEvent !== null;

  return (
    <StyledButton $isShow={isFacShow || isEventShow} $left={left} onClick={handleBtn}>
      <span>{scNm}</span>
    </StyledButton>
  );
};

export default CctvEnd;

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
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }

  span {
    padding-right: 8px;
    color: #d4d6df;
  }
`;
