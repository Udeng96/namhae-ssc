import styled from 'styled-components';
import { useScheStore } from '@/component/stores/scheStore';
import { SCHE_TYPE } from '@/component/constants/scheConst';
import ScheFileNotice from '@/component/pages/manage/sche/file/body/ScheFileNotice';
import ScheFileResult from '@/component/pages/manage/sche/file/body/ScheFileResult';

const ScheFileBody = () => {
  const activeType = useScheStore((s) => s.activeType);
  const isNotice   = activeType !== SCHE_TYPE.CONTENT;

  return (
    <StyledBody>
      <StyledHeaderWrap>
        <StyledHeaderRow>
          <StyledHeaderCell>파일 명</StyledHeaderCell>
          <StyledHeaderCell>{isNotice ? '파일 크기' : '재생 시간'}</StyledHeaderCell>
          <StyledHeaderCell>파일 타입</StyledHeaderCell>
          <StyledHeaderCell>삭제</StyledHeaderCell>
        </StyledHeaderRow>
      </StyledHeaderWrap>
      {isNotice && <ScheFileNotice />}
      <ScheFileResult />
    </StyledBody>
  );
};

export default ScheFileBody;

const StyledBody = styled.div`
  padding: 8px 12px 25px 24px;
`;

const StyledHeaderWrap = styled.div`
  margin-top: 7px;
  margin-bottom: 4px;
  color: #A8AFBD;
`;

const StyledHeaderRow = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 8px;
`;

const StyledHeaderCell = styled.li`
  height: 24px;
  padding: 0 6px;
  font-size: 13px;
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;

  &:nth-child(1) { width: 160px; justify-content: flex-start; padding: 0 16px; }
  &:nth-child(2) { width: 123px; justify-content: center; }
  &:nth-child(3) { width: 115px; justify-content: flex-start; }
  &:nth-child(4) { width: 66px;  align-items: center; justify-content: center; }
`;
