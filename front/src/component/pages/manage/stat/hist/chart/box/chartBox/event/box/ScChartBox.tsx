import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { EventStatSc } from '@/component/types/stat';
import ScLegend from '../legend/ScLegend';
import ScChart  from '../chart/ScChart';

const ScChartBox = ({ scList, isAreaSelected }: { scList: EventStatSc[]; isAreaSelected: boolean }) => (
  <StyledBox>
    <h2>이벤트 발생율 경로당 {isAreaSelected ? 'TOP5' : 'TOP10'}</h2>
    <div>
      <ScLegend />
      <ScChart subSc={scList} isAreaSelected={isAreaSelected} />
    </div>
  </StyledBox>
);

export default ScChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
