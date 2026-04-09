import styled from 'styled-components';
import TitleForm    from '@/component/pages/manage/sche/main/board/form/TitleForm';
import ScForm       from '@/component/pages/manage/sche/main/board/form/ScForm';
import DateForm     from '@/component/pages/manage/sche/main/board/form/date/DateForm';
import ContentsForm from '@/component/pages/manage/sche/main/board/form/ContentsForm';
import ScheBoardBtn from '@/component/pages/manage/sche/main/board/btn/ScheBoardBtn';
import { SCHE_TYPE } from '@/component/constants/scheConst';

const ScheBoardContent = () => (
  <StyledContent>
    <TitleForm />
    <ScForm />
    <DateForm contentType={SCHE_TYPE.CONTENT} />
    <ContentsForm />
    <ScheBoardBtn />
  </StyledContent>
);

export default ScheBoardContent;

const StyledContent = styled.li`
  height: 738px;
  padding: 32px 24px 32px 32px;
  font-size: 13px;
  color: #F2F4FC;
  background-color: #1A203A;
`;
