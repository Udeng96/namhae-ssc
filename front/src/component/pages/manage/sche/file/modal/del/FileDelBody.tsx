import styled from 'styled-components';

const FileDelBody = () => (
  <StyledBody>
    선택 영상을 삭제하시면 해당 영상이 포함된<br />
    모든 스케쥴에서 삭제가 됩니다.<br />
    정말 삭제를 진행하시겠습니까?
  </StyledBody>
);

export default FileDelBody;

const StyledBody = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 26px 90px 26px 32px;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  color: #F2F4FC;
  line-height: normal;

  &::before, &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
  }
  &::before { top: 0;    background: linear-gradient(90deg, #543FAF, #2A2E54); }
  &::after  { bottom: 0; background: linear-gradient(90deg, #2A2E54, #543FAF); }
`;
