import styled from 'styled-components';
import { CommonSkeleton, CommonSkeletonItem } from '@/component/lib/css';

const FacSkeleton = () => (
  <StyledBox>
    {Array.from({ length: 15 }).map((_, i) => (
      <StyledItem key={i} />
    ))}
  </StyledBox>
);

export default FacSkeleton;

const StyledBox = styled.div`
  ${CommonSkeleton};
  width: 468px;
  height: 627px;
`;

const StyledItem = styled.div`
  ${CommonSkeletonItem};
`;
