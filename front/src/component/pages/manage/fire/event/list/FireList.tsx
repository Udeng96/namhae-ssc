import styled from 'styled-components';
import FireListHead from './FireListHead';
import FireListBody from './FireListBody';

const FireList = () => (
  <StyledList>
    <FireListHead />
    <FireListBody />
  </StyledList>
);

export default FireList;

const StyledList = styled.div`
  padding: 0 19px 0 32px;
  top: 0;
`;
