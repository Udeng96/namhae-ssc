import styled from 'styled-components';
import { CommonError, CommonErrorBtn } from '@/component/lib/css';

interface Props {
  onReload: () => void;
}

const LastEventError = ({ onReload }: Props) => (
  <StyledError>
    <StyledErrorBtn onClick={onReload} />
    <p>데이터 로드에 문제가 발생하였습니다.</p>
    <p>Reload 또는 재검색을 시도해 주세요.</p>
  </StyledError>
);

export default LastEventError;

const StyledError = styled.div`
  ${CommonError};
  width: 100%;
  height: 375px;
`;

const StyledErrorBtn = styled.button`
  ${CommonErrorBtn};
`;
