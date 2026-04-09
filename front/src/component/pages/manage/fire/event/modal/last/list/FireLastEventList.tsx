import styled from 'styled-components';
import FireLastEventLeft from './left/FireLastEventLeft';
import FireLastEventRight from './right/FireLastEventRight';

interface Props {
  onReload: () => void;
  onPageChange: () => void;
  isError: boolean;
}

const FireLastEventList = ({ onReload, onPageChange, isError }: Props) => (
  <StyledList>
    <FireLastEventLeft onReload={onReload} onPageChange={onPageChange} isError={isError} />
    <FireLastEventRight />
  </StyledList>
);

export default FireLastEventList;

const StyledList = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0 16px;
  width: 100%;
`;
