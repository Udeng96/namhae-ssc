import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { FacStatType } from '@/component/types/stat';
import TypeLegend from '../legend/TypeLegend';
import TypeChart  from '../chart/TypeChart';

const TypeChartBox = ({ facList }: { facList: FacStatType[] }) => (
  <StyledBox>
    <h2>유형별 시설물 고장 통계</h2>
    <div>
      <TypeLegend />
      <TypeChart facList={facList} />
    </div>
  </StyledBox>
);

export default TypeChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
