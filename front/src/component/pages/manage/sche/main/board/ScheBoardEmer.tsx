import styled from 'styled-components';
import SortForm     from '@/component/pages/manage/sche/main/board/form/SortForm';
import TitleForm    from '@/component/pages/manage/sche/main/board/form/TitleForm';
import ScForm       from '@/component/pages/manage/sche/main/board/form/ScForm';
import DateForm     from '@/component/pages/manage/sche/main/board/form/date/DateForm';
import TextForm     from '@/component/pages/manage/sche/main/board/form/TextForm';
import ExpireForm   from '@/component/pages/manage/sche/main/board/form/token/ExpireForm';
import ScheBoardBtn from '@/component/pages/manage/sche/main/board/btn/ScheBoardBtn';
import { SCHE_MODAL_TYPE, SCHE_TYPE } from '@/component/constants/scheConst';
import { useCommonStore } from '@/component/stores/commonStore';

const ScheBoardEmer = () => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  return (
    <StyledEmer>
      <SortForm />
      <TitleForm />
      <ScForm />
      <DateForm contentType={SCHE_TYPE.EMER} />
      <TextForm isNorm={false} />
      <StyledPrevBtn onClick={() => setModal(SCHE_MODAL_TYPE.PREV_EMER)}>미리보기 &gt;</StyledPrevBtn>
      <ExpireForm />
      <ScheBoardBtn />
    </StyledEmer>
  );
};

export default ScheBoardEmer;

const StyledEmer = styled.li`
  height: 738px;
  padding: 32px 24px 32px 32px;
  font-size: 13px;
  color: #F2F4FC;
  background-color: #1A203A;
`;

const StyledPrevBtn = styled.button`
  width: 100%;
  height: auto;
  font-size: 12px;
  text-align: right;
  margin-top: 12px !important;
  margin-bottom: 16px !important;
  padding-right: 7px !important;
  &:hover { color: rgb(156, 123, 255); }
`;
