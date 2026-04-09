import styled from 'styled-components';
import EventListHead from './EventListHead';
import EventListBody from './EventListBody';

const EventList = () => (
  <StyledEventList>
    <EventListHead />
    <EventListBody />
  </StyledEventList>
);

export default EventList;

const StyledEventList = styled.div`
  padding: 0 19px 0 32px;
`;
