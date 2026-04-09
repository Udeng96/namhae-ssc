import styled from 'styled-components';
import FacListBoxHead from './FacListBoxHead';
import FacListBoxBody from './FacListBoxBody';

const FacListBox = () => (
  <StyledBox>
    <FacListBoxHead />
    <FacListBoxBody />
  </StyledBox>
);

export default FacListBox;

const StyledBox = styled.div`
  padding: 0 19px 0 32px;
`;
