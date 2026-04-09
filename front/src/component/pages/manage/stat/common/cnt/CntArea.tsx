import styled from 'styled-components';
import CntHead from '@/component/pages/manage/stat/common/cnt/CntHead';
import CntBody from '@/component/pages/manage/stat/common/cnt/CntBody';

const CntArea = () => (
  <StyledCntArea>
    <CntHead />
    <CntBody />
  </StyledCntArea>
);

export default CntArea;

const StyledCntArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 350px;
  height: 100%;
  background: #0F1223;
  position: relative;
  z-index: 10;
`;
