import styled from 'styled-components';
import { CommonSkeleton, CommonSkeletonItem } from '@/component/lib/css';

const SKELETON_COUNT = 14;

const FireSkeleton = () => (
  <StyledSkeleton>
    {Array.from({ length: SKELETON_COUNT }, (_, i) => (
      <StyledItem key={i} />
    ))}
  </StyledSkeleton>
);

export default FireSkeleton;

const StyledSkeleton = styled.div`
  ${CommonSkeleton};
  width: 468px;
  height: 627px;
`;

const StyledItem = styled.div`
  ${CommonSkeletonItem};
`;
