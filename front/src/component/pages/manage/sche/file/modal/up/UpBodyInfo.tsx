import styled from 'styled-components';

interface Props { fileNm: string; }

const UpBodyInfo = ({ fileNm }: Props) => (
  <StyledInfo>{fileNm}</StyledInfo>
);

export default UpBodyInfo;

const StyledInfo = styled.div`
  max-width: 434px;
  height: auto;
  margin-top: 16px;
  text-align: center;
  color: #F2F4FC;
  font-size: 14px;
  font-weight: 400;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
