import styled from 'styled-components';
import { CommonSkeleton, CommonSkeletonItem } from '@/component/lib/css';

const FileSkeleton = () => (
  <StyledSkeleton $isNotice>
    {Array.from({ length: 16 }).map((_, i) => (
      <StyledItem key={i} />
    ))}
  </StyledSkeleton>
);

export default FileSkeleton;

const StyledSkeleton = styled.div<{ $isNotice: boolean }>`
  ${CommonSkeleton};
  height: ${({ $isNotice }) => ($isNotice ? '672px' : '736px')};
  width: 482px;
`;

const StyledItem = styled.div`${CommonSkeletonItem}`;
