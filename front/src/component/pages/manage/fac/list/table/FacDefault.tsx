import styled from 'styled-components';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { CommonScrollBar, CommonScrollBox } from '@/component/lib/css';
import { useFacStore } from '@/component/stores/facStore';
import { ScFacType } from '@/component/types/fac';
import FacDefaultRow from './FacDefaultRow';

const FacDefault = ({ facs }: { facs: ScFacType[] }) => {
  const { selectFac, setSelectFac, setEventStartDtm, setEventEndDtm, setFacEventList } = useFacStore(
    useShallow((state) => ({
      selectFac:       state.selectFac,
      setSelectFac:    state.actions.setSelectFac,
      setEventStartDtm: state.actions.setEventStartDtm,
      setEventEndDtm:   state.actions.setEventEndDtm,
      setFacEventList:  state.actions.setFacEventList,
    })),
  );

  const today = moment().format('YYYYMMDD');

  const handleSelect = (fac: ScFacType) => {
    if (selectFac?.mgtNo === fac.mgtNo) {
      setSelectFac(null);
    } else {
      setSelectFac(fac);
      setEventStartDtm(today);
      setEventEndDtm(today);
      setFacEventList([]);
    }
  };

  return (
    <StyledBox>
      {facs.map((fac) => (
        <StyledWrap key={fac.mgtNo} onClick={() => handleSelect(fac)}>
          <StyledItem $isActive={selectFac?.mgtNo === fac.mgtNo}>
            <FacDefaultRow item={fac} />
          </StyledItem>
        </StyledWrap>
      ))}
    </StyledBox>
  );
};

export default FacDefault;

const StyledBox = styled.div`
  ${CommonScrollBox};
  ${CommonScrollBar};
  padding-right: 8px;
  height: 627px;
`;

const StyledWrap = styled.div`
  & + div { margin-top: 3px; }
`;

const StyledItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 39px;
  padding: 4px 7px;
  border-radius: 7px;
  background: ${({ $isActive }) => ($isActive ? '#261e5e' : '#1a203a')};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#7a45ff' : '#2a2e54')};
  cursor: pointer;
  font-weight: 400;
  font-size: 13px;

  &:hover {
    background: ${({ $isActive }) => ($isActive ? '#261e5e' : '#2a2e54')};
    border: 1px solid ${({ $isActive }) => ($isActive ? '#7a45ff' : '#543faf')};
  }
`;
