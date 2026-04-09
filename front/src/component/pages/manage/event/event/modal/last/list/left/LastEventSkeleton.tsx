import styled from 'styled-components';
import { CommonSkeleton, CommonSkeletonItem } from '@/component/lib/css';
import { ANI_KEYFRAME } from '@/component/lib/animations';

const LastEventSkeleton = () => (
  <StyledSkeleton>
    {Array.from({ length: 9 }).map((_, i) => (
      <StyledSkeletonItem key={i} />
    ))}
  </StyledSkeleton>
);

export default LastEventSkeleton;

const StyledSkeleton = styled.div`
  ${CommonSkeleton};
  width: 100%;
  height: 375px;
`;

const StyledSkeletonItem = styled.div`
  ${CommonSkeletonItem};
  background-size: 411% 100%;
  animation: ${ANI_KEYFRAME.EVENT.LAST} 3300ms ease-in-out infinite;
`;
