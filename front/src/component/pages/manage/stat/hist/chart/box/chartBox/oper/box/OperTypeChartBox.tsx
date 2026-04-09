import styled from 'styled-components';
import { CommonChartBox } from '@/component/lib/css';
import { FacStatType } from '@/component/types/stat';
import OperTypeLegend from '../legend/OperTypeLegend';
import OperTypeChart  from '../chart/OperTypeChart';

const OperTypeChartBox = ({ facTypeList }: { facTypeList: FacStatType[] }) => (
  <StyledBox>
    <h3>유형별 가동률</h3>
    <div>
      <OperTypeLegend />
      <OperTypeChart facTypeList={facTypeList} />
    </div>
  </StyledBox>
);

export default OperTypeChartBox;

const StyledBox = styled.div`
  ${CommonChartBox}
`;
