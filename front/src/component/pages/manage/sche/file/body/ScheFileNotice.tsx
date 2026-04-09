import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';

const ScheFileNotice = () => (
  <StyledNotice>
    <i />
    <p>정보표출 모니터 32인치(856 x 1130) 크기의 JPG, JPEG, PNG 파일을 등록해 주세요.</p>
  </StyledNotice>
);

export default ScheFileNotice;

const StyledNotice = styled.div`
  display: flex;
  gap: 17px;
  justify-content: center;
  align-items: center;
  width: 482px;
  height: 56px;
  flex-shrink: 0;
  border: 1px solid #5653AD;
  border-left-width: 4px;
  background: rgba(127, 122, 255, 0.15);
  margin-bottom: 8px;

  i {
    width: 22px;
    height: 22px;
    background: url("${SCHE_IMAGE.FILE.HEAD.NOTICE_ICON}") no-repeat center / 100%;
  }

  p {
    color: #7F7AFF;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }
`;
