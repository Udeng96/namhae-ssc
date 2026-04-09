import styled from 'styled-components';

interface Props { isShow: boolean; content: string; }

const FileDefaultTooltip = ({ isShow, content }: Props) => (
  <StyledTooltip $isShow={isShow}>{content}</StyledTooltip>
);

export default FileDefaultTooltip;

const StyledTooltip = styled.div<{ $isShow: boolean }>`
  display: ${({ $isShow }) => ($isShow ? 'block' : 'none')};
  position: absolute;
  padding: 8px;
  word-break: break-all;
  border-radius: 4px;
  border: 1px solid #7A45FF;
  background: #12172E;
  z-index: 1;
  top: 26px;
  left: 21px;
`;
