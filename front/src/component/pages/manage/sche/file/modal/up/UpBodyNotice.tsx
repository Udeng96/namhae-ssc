import styled from 'styled-components';

interface Props { isContent: boolean; }

const UpBodyNotice = ({ isContent }: Props) => (
  <StyledNotice>
    {isContent ? (
      <>
        최대 1GB 이하의 파일만 등록 할 수 있습니다.<br />
        (MP4, WMV, MOV, FLV 형식 파일)<br />
        (PNG, JPG, JPEG 형식 파일)
      </>
    ) : (
      <>
        최대 200MB 이하의 파일만 등록할 수 있습니다.<br />
        (PNG, JPG, JPEG 형식 파일)
      </>
    )}
  </StyledNotice>
);

export default UpBodyNotice;

const StyledNotice = styled.div`
  width: auto;
  height: auto;
  text-align: center;
  font-size: 11px;
  font-weight: 300;
  line-height: 1.33;
  color: #A8AFBD;
  margin-top: 16px;
`;
