import styled from 'styled-components';
import { CommonScrollBar } from '@/component/lib/css';
import { TodayEventItem } from '@/component/types/event';
import FacEventDefaultItem from './FacEventDefaultItem';

const FacEventDefault = ({ list }: { list: TodayEventItem[] }) => (
  <StyledBox>
    {list.map((item) => (
      <FacEventDefaultItem key={item.statEvetOutbSeqn} item={item} />
    ))}
  </StyledBox>
);

export default FacEventDefault;

const StyledBox = styled.div`
  ${CommonScrollBar};
  padding-right: 8px;
  overflow: hidden;
  overflow-y: auto;
  height: 501px;
`;
