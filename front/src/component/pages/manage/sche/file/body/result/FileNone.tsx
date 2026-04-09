import styled from 'styled-components';
import { CommonNone } from '@/component/lib/css';

interface Props { isNotice: boolean; }

const FileNone = ({ isNotice }: Props) => (
  <StyledNone $isNotice={isNotice}>
    <i />
    <p>등록된 콘텐츠가 없습니다.</p>
    <p>콘텐츠를 업로드 해주세요.</p>
  </StyledNone>
);

export default FileNone;

const StyledNone = styled.div<{ $isNotice: boolean }>`
  ${CommonNone};
  height: ${({ $isNotice }) => ($isNotice ? '672px' : '736px')};
  width: 482px;
  p { line-height: 1.66; }
`;
