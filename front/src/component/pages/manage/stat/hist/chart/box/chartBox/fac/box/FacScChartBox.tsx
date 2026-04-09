import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { EventStatSc } from '@/component/types/stat';
import FacScLegend from '../legend/FacScLegend';
import FacScChart  from '../chart/FacScChart';

const FacScChartBox = ({ scList, isAreaSelected }: { scList: EventStatSc[]; isAreaSelected: boolean }) => (
  <StyledBox>
    <h2>시설물 고장율 경로당 {isAreaSelected ? 'TOP5' : 'TOP10'}</h2>
    <div>
      <FacScLegend />
      <FacScChart scList={scList} isAreaSelected={isAreaSelected} />
    </div>
  </StyledBox>
);

export default FacScChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
