import styled from 'styled-components';
import { CommonScheSelectBox } from '@/component/lib/css';
import ScheDatePicker from '@/component/pages/manage/sche/main/board/form/date/date/ScheDatePicker';

const DateSelect = () => (
  <StyledDateSelect className="schedule">
    <ScheDatePicker type="start" />
    <p>~</p>
    <ScheDatePicker type="end" />
  </StyledDateSelect>
);

export default DateSelect;

const StyledDateSelect = styled.div`
  ${CommonScheSelectBox};
`;
