import styled from 'styled-components';
import SortForm     from '@/component/pages/manage/sche/main/board/form/SortForm';
import TitleForm    from '@/component/pages/manage/sche/main/board/form/TitleForm';
import ScForm       from '@/component/pages/manage/sche/main/board/form/ScForm';
import DateForm     from '@/component/pages/manage/sche/main/board/form/date/DateForm';
import TextForm     from '@/component/pages/manage/sche/main/board/form/TextForm';
import FileForm     from '@/component/pages/manage/sche/main/board/form/FileForm';
import ScheBoardBtn from '@/component/pages/manage/sche/main/board/btn/ScheBoardBtn';
import { SCHE_MODAL_TYPE, SCHE_TYPE } from '@/component/constants/scheConst';
import { useCommonStore } from '@/component/stores/commonStore';

const ScheBoardNorm = () => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  return (
    <StyledNorm>
      <SortForm />
      <TitleForm />
      <ScForm />
      <DateForm contentType={SCHE_TYPE.NORM} />
      <TextForm isNorm={true} />
      <FileForm />
      <StyledPrevBtn onClick={() => setModal(SCHE_MODAL_TYPE.PREV_NORM)}>미리보기 &gt;</StyledPrevBtn>
      <ScheBoardBtn />
    </StyledNorm>
  );
};

export default ScheBoardNorm;

const StyledNorm = styled.li`
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
