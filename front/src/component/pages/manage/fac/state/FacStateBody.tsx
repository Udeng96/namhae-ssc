import styled from 'styled-components';
import { useFacStore } from '@/component/stores/facStore';
import FacStateBell from './FacStateBell';
import FacStateFire from './FacStateFire';
import FacStateSettop from './FacStateSettop';
import FacStateCctv from './FacStateCctv';
import FacEventHead from '../event/FacEventHead';
import FacEventBody from '../event/FacEventBody';

const FacStateBody = () => {
  const selectFac = useFacStore((state) => state.selectFac);
  const f = selectFac;

  return (
    <>
      <StyledSensors>
        <FacStateBell  bell={f?.bell    ?? '00'} />
        <FacStateFire  fire={f?.fire    ?? '00'} />
        <FacStateSettop settop1={f?.settop1 ?? '00'} settop2={f?.settop2 ?? '00'} />
        <FacStateCctv  cctv3={f?.cctvT  ?? '00'} cctvB={f?.cctvB ?? '00'} cctvK={f?.cctvK ?? '00'} cctvL={f?.cctvL ?? '00'} />
      </StyledSensors>
      <StyledEvent>
        <FacEventHead />
        <FacEventBody />
      </StyledEvent>
    </>
  );
};

export default FacStateBody;

const StyledSensors = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 0 24px;
  align-items: center;
  justify-content: center;
`;

const StyledEvent = styled.div``;
