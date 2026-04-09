import styled from 'styled-components';
import { CommonError, CommonErrorBtn } from '@/component/lib/css';
import { useQueryClient } from '@tanstack/react-query';

const EventError = () => {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['events', 'current'] });
  };

  return (
    <StyledError>
      <StyledRetryBtn onClick={handleRetry} />
      <p>데이터 로드에 문제가 발생하였습니다.</p>
      <p>Reload 또는 재검색을 시도해 주세요.</p>
    </StyledError>
  );
};

export default EventError;

const StyledError = styled.div`
  ${CommonError};
  width: 468px;
  height: 627px;
`;

const StyledRetryBtn = styled.button`
  ${CommonErrorBtn};
`;
