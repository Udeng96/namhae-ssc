import styled from 'styled-components';
import FireLastSearchOption from './FireLastSearchOption';

interface Props {
  type: 'lastArea' | 'lastEvent';
  nm: string;
}

const FireLastSearchBox = ({ type, nm }: Props) => (
  <StyledBox>
    <StyledNm>{nm}</StyledNm>
    <StyledValue>
      <FireLastSearchOption type={type} />
    </StyledValue>
  </StyledBox>
);

export default FireLastSearchBox;

const StyledBox = styled.div`
  display: flex;
  align-items: center;

  &:first-of-type { margin-top: 12px; }
  & + div        { margin-top: 7px; }
  &:last-of-type { margin-bottom: 12px; }
`;

const StyledNm = styled.div`
  width: calc(100% - 728px);
  font-size: 14px;
  color: #f2f4fc;
`;

const StyledValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0 26px;
  width: 728px;
`;
