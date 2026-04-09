import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';

const ScheMainHead = () => (
  <StyledHead>
    <i />
    <h3>콘텐츠 스케쥴링</h3>
  </StyledHead>
);

export default ScheMainHead;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px 0 22px;
  border-bottom: solid 1px #222A47;

  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    background: url("${SCHE_IMAGE.MAIN.HEAD.TITLE_ICON}") no-repeat center / 100%;
  }

  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #F2F4FC;
  }
`;
