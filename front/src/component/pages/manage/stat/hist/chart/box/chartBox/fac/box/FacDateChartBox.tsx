import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { EventStatDate } from '@/component/types/stat';
import FacDateLegend from '../legend/FacDateLegend';
import FacDateChart  from '../chart/FacDateChart';

const FacDateChartBox = ({ dateList }: { dateList: EventStatDate[] }) => (
  <StyledBox>
    <h3>전체 시설물 고장 통계</h3>
    <div>
      <FacDateLegend />
      <FacDateChart dateList={dateList} />
    </div>
  </StyledBox>
);

export default FacDateChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
