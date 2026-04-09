import styled from 'styled-components';
import LastEventLeft from './left/LastEventLeft';
import LastEventRight from './right/LastEventRight';

interface Props {
  onReload: () => void;
  onPageChange: () => void;
  isError: boolean;
}

const LastEventList = ({ onReload, onPageChange, isError }: Props) => (
  <StyledList>
    <LastEventLeft onReload={onReload} onPageChange={onPageChange} isError={isError} />
    <LastEventRight />
  </StyledList>
);

export default LastEventList;

const StyledList = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0 16px;
  width: 100%;
`;
